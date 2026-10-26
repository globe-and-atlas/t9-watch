#include <pebble.h>
#include <stdio.h>
#include <string.h>

#include "t9_model.h"
#include "lcd_font.h"
#include "razr_font.h"

#define STORE_TIME_FORMAT 1
#define STORE_BACKGROUND_COLOR 2
#define STORE_TEXT_COLOR 3
#define STORE_PHONE_MODEL 4
#define STORE_SHOW_BATTERY 5
#define STORE_USE_MODEL_COLORS 6
#define STORE_ZERO_WORDING 7
#define DEFAULT_BACKGROUND_COLOR 0xAAFFAA
#define DEFAULT_TEXT_COLOR 0x000000
#define RAZR_BACKGROUND_COLOR 0x000055
#define RAZR_TEXT_COLOR 0xAAFFFF
#define STEP_MS 105

static Window *s_window;
static Layer *s_face;
static AppTimer *s_timer;
static T9Time s_time;
static bool s_use_24h;
static bool s_use_oh_zero;
static bool s_razr;
static bool s_show_battery;
static bool s_use_model_colors;
static uint32_t s_background_color;
static uint32_t s_text_color;
static bool s_hour_changed;
static char s_hour_display[2][20];
static char s_minute_display[2][20];
static int s_token;
static int s_character;
static int s_highlight_key;
static bool s_showing_alternate;

static const LcdGlyph *lcd_glyph(char c) {
  const char *position = strchr(LCD_CHARS, c);
  return position ? &LCD_GLYPHS[position - LCD_CHARS] : NULL;
}

static int razr_index(char c) {
  if (c >= 'A' && c <= 'Z') return c - 'A';
  if (c >= '0' && c <= '9') return 26 + c - '0';
  return -1;
}

static int compact_text_width(const char *text, int scale) {
  int count = (int)strlen(text);
  return count ? (count * 6 - 1) * scale : 0;
}

static int text_width(const char *text, int scale) {
  if (s_razr) return compact_text_width(text, scale);
  int width = 0;
  for (; *text; text++) {
    const LcdGlyph *glyph = lcd_glyph(*text);
    width += glyph ? glyph->advance : 4;
  }
  return width * scale;
}

static void draw_compact_text(GContext *ctx, const char *text, int x, int y,
                              int scale, GColor color) {
  graphics_context_set_fill_color(ctx, color);
  for (; *text; text++, x += 6 * scale) {
    if (*text == ':' || *text == '\'') {
      graphics_fill_rect(ctx, GRect(x + 2 * scale, y + 2 * scale,
                                    scale, scale), 0, GCornerNone);
      if (*text == ':') graphics_fill_rect(ctx, GRect(x + 2 * scale,
                                    y + 5 * scale, scale, scale), 0, GCornerNone);
      continue;
    }
    int index = razr_index(*text);
    if (index < 0) continue;
    for (int row = 0; row < 7; row++) {
      for (int column = 0; column < 5; column++) {
        if (RAZR_GLYPHS[index][row] & (1 << (4 - column))) {
          graphics_fill_rect(ctx, GRect(x + column * scale, y + row * scale,
                                        scale, scale), 0, GCornerNone);
        }
      }
    }
  }
}

static void draw_text(GContext *ctx, const char *text, int x, int y, int scale,
                      GColor color) {
  if (s_razr) {
    draw_compact_text(ctx, text, x, y, scale, color);
    return;
  }
  graphics_context_set_fill_color(ctx, color);
  for (; *text; text++) {
    const LcdGlyph *glyph = lcd_glyph(*text);
    if (!glyph) {
      x += 4 * scale;
      continue;
    }
    for (int row = 0; row < LCD_GLYPH_HEIGHT; row++) {
      for (int column = 0; column < glyph->width; column++) {
        if (glyph->rows[row] & (1 << (glyph->width - 1 - column))) {
          graphics_fill_rect(ctx, GRect(x + column * scale, y + row * scale,
                                        scale, scale), 0, GCornerNone);
        }
      }
    }
    x += glyph->advance * scale;
  }
}

static void draw_nokia_key(GContext *ctx, int x, int y, int tilt,
                           bool active, GColor ink, GColor paper) {
  const int width = 56;
  const int height = 13;
  int starts[height];
  int ends[height];
  for (int row = 0; row < height; row++) {
    int edge = row < height / 2 ? row : height - 1 - row;
    int taper = edge == 0 ? 5 : edge == 1 ? 3 : edge == 2 ? 2 : edge == 3 ? 1 : 0;
    int skew = tilt * (row - height / 2) / (height / 2);
    starts[row] = x + taper + skew;
    ends[row] = x + width - 1 - taper + skew;
    graphics_context_set_fill_color(ctx, active ? ink : paper);
    graphics_fill_rect(ctx, GRect(starts[row], y + row,
                                  ends[row] - starts[row] + 1, 1), 0, GCornerNone);
  }
  graphics_context_set_stroke_color(ctx, ink);
  graphics_draw_line(ctx, GPoint(starts[0], y), GPoint(ends[0], y));
  graphics_draw_line(ctx, GPoint(starts[height - 1], y + height - 1),
                     GPoint(ends[height - 1], y + height - 1));
  for (int row = 1; row < height - 1; row++) {
    graphics_draw_pixel(ctx, GPoint(starts[row], y + row));
    graphics_draw_pixel(ctx, GPoint(ends[row], y + row));
  }
}

static void draw_keypad(GContext *ctx, GColor ink, GColor paper) {
  static const char *const LABELS[12] = {
    "1", "2 ABC", "3 DEF", "4 GHI", "5 JKL", "6 MNO",
    "7 PQRS", "8 TUV", "9 WXYZ", "*", "0", "#"
  };
  if (s_razr) {
    GRect plate = GRect(9, 167, 182, 59);
    graphics_context_set_stroke_color(ctx, ink);
    graphics_draw_round_rect(ctx, plate, 3);
    graphics_draw_line(ctx, GPoint(69, 168), GPoint(69, 225));
    graphics_draw_line(ctx, GPoint(130, 168), GPoint(130, 225));
    for (int row = 1; row < 4; row++) {
      int y = 167 + row * 15;
      graphics_draw_line(ctx, GPoint(10, y), GPoint(190, y));
    }
    for (int key = 0; key < 12; key++) {
      int x = 10 + (key % 3) * 61;
      int y = 168 + (key / 3) * 15;
      bool active = key < 9 && s_highlight_key == key + 1;
      if (active) {
        graphics_context_set_fill_color(ctx, ink);
        graphics_fill_rect(ctx, GRect(x + 1, y + 1, 58, 12), 0, GCornerNone);
      }
      int width = text_width(LABELS[key], 1);
      draw_text(ctx, LABELS[key], x + (59 - width) / 2, y + 3, 1,
                active ? paper : ink);
    }
    return;
  }
  for (int key = 0; key < 12; key++) {
    int column = key % 3;
    int x = 10 + column * 62;
    int y = 168 + (key / 3) * 15;
    int tilt = column == 0 ? 2 : column == 2 ? -2 : 0;
    bool active = key < 9 && s_highlight_key == key + 1;
    draw_nokia_key(ctx, x, y, tilt, active, ink, paper);
    int width = compact_text_width(LABELS[key], 1);
    draw_compact_text(ctx, LABELS[key], x + (56 - width) / 2, y + 3, 1,
                      active ? paper : ink);
  }
}

static void current_word(const char **target, char **display, bool *is_hour) {
  if (s_token < s_time.hour_count) {
    *is_hour = true;
    *target = s_time.hour[s_token];
    *display = s_hour_display[s_token];
  } else {
    int index = s_token - s_time.hour_count;
    *is_hour = false;
    *target = s_time.minute[index];
    *display = s_minute_display[index];
  }
}

static void schedule_next(uint32_t delay);

static void animation_step(void *context) {
  s_timer = NULL;
  if (s_token >= s_time.hour_count + s_time.minute_count) {
    s_highlight_key = 0;
    layer_mark_dirty(s_face);
    return;
  }

  const char *target;
  char *display;
  bool is_hour;
  current_word(&target, &display, &is_hour);

  if (s_showing_alternate) {
    strncpy(display, target, 19);
    display[19] = '\0';
    s_showing_alternate = false;
    s_highlight_key = 0;
    s_token++;
    s_character = 0;
    layer_mark_dirty(s_face);
    schedule_next(135);
    return;
  }

  size_t length = strlen(target);
  while (s_character < (int)length && !t9_key(target[s_character])) {
    s_character++;
  }
  if (s_character < (int)length) {
    s_highlight_key = t9_key(target[s_character]);
    s_character++;
    memcpy(display, target, (size_t)s_character);
    display[s_character] = '\0';
    if (s_character == (int)length) {
      const char *alternate = t9_alternate(target);
      if (alternate && (!is_hour || s_hour_changed)) {
        strncpy(display, alternate, 19);
        display[19] = '\0';
        s_showing_alternate = true;
        layer_mark_dirty(s_face);
        schedule_next(275);
        return;
      }
    }
    layer_mark_dirty(s_face);
    schedule_next(STEP_MS);
    return;
  }

  s_highlight_key = 0;
  s_token++;
  s_character = 0;
  layer_mark_dirty(s_face);
  schedule_next(135);
}

static void schedule_next(uint32_t delay) {
  s_timer = app_timer_register(delay, animation_step, NULL);
}

static void combine_hour(char *out, size_t capacity) {
  snprintf(out, capacity, "%s%s%s", s_hour_display[0],
           s_hour_display[1][0] ? " " : "", s_hour_display[1]);
}

static void draw_face(Layer *layer, GContext *ctx) {
  GRect bounds = layer_get_bounds(layer);
  uint32_t background = s_use_model_colors ?
    (s_razr ? RAZR_BACKGROUND_COLOR : DEFAULT_BACKGROUND_COLOR) : s_background_color;
  uint32_t foreground = s_use_model_colors ?
    (s_razr ? RAZR_TEXT_COLOR : DEFAULT_TEXT_COLOR) : s_text_color;
  GColor paper = GColorFromHEX(background);
  GColor ink = GColorFromHEX(foreground);
  graphics_context_set_fill_color(ctx, paper);
  graphics_fill_rect(ctx, bounds, 0, GCornerNone);

  if (s_razr) {
    graphics_context_set_stroke_color(ctx, ink);
    graphics_draw_round_rect(ctx, GRect(5, 4, 190, 159), 4);
  }

  /* Show actual watch charge without implying a signal-strength measurement. */
  graphics_context_set_fill_color(ctx, ink);
  if (s_show_battery) {
    graphics_draw_rect(ctx, GRect(9, 8, 16, 18));
    graphics_fill_rect(ctx, GRect(25, 13, 2, 8), 0, GCornerNone);
    int battery_height = battery_state_service_peek().charge_percent * 12 / 100;
    if (battery_height) {
      graphics_fill_rect(ctx, GRect(12, 23 - battery_height, 10, battery_height), 0, GCornerNone);
    }
  }
  draw_text(ctx, s_time.numeric, 200 - 9 - text_width(s_time.numeric, 3),
            s_razr ? 6 : 3, 3, ink);
  graphics_context_set_stroke_color(ctx, ink);
  graphics_draw_line(ctx, GPoint(9, 33), GPoint(190, 33));
  draw_compact_text(ctx, "HOUR", 9, 39, 1, ink);

  char hour_line[40];
  combine_hour(hour_line, sizeof(hour_line));
  int hour_scale = text_width(hour_line, 3) <= 182 ? 3 : 2;
  int hour_y = s_razr ? 51 : 48;
  draw_text(ctx, hour_line, 9, hour_y, hour_scale, ink);

  const char *first = s_minute_display[0];
  const char *second = s_minute_display[1];
  int minute_max_scale = s_razr && s_time.minute_count == 1 ? 4 : 3;
  int first_scale = text_width(first, minute_max_scale) <= 182 ? minute_max_scale : minute_max_scale - 1;
  int second_scale = text_width(second, minute_max_scale) <= 182 ? minute_max_scale : minute_max_scale - 1;
  if (s_time.minute_count == 1) {
    draw_text(ctx, first, 9, 91, first_scale, ink);
  } else {
    draw_text(ctx, first, 9, s_razr ? 80 : 79, first_scale, ink);
    draw_text(ctx, second, 9, s_razr ? 111 : 110, second_scale, ink);
  }
  if (s_timer && s_token < s_time.hour_count + s_time.minute_count) {
    int cursor_x;
    int cursor_y;
    int cursor_width;
    if (s_token < s_time.hour_count) {
      cursor_x = 9 + text_width(hour_line, hour_scale);
      cursor_y = hour_y + (s_razr ? 7 : 9) * hour_scale - 3;
      cursor_width = 5 * hour_scale;
    } else {
      int minute_index = s_token - s_time.hour_count;
      const char *shown = minute_index == 0 ? first : second;
      int scale = minute_index == 0 ? first_scale : second_scale;
      cursor_x = 9 + text_width(shown, scale);
      cursor_y = (s_time.minute_count == 1 ? 91 :
                  (minute_index == 0 ? (s_razr ? 80 : 79) : (s_razr ? 111 : 110))) +
                 (s_razr ? 7 : 9) * scale - 3;
      cursor_width = 5 * scale;
    }
    graphics_context_set_fill_color(ctx, ink);
    graphics_fill_rect(ctx, GRect(cursor_x, cursor_y, cursor_width, 3), 0, GCornerNone);
  }
  draw_compact_text(ctx, "MINUTE", 9, 142, 1, ink);

  char keys[36] = "";
  char fragment[20];
  for (int index = 0; index < s_time.minute_count; index++) {
    t9_keys_for_word(s_time.minute[index], fragment, sizeof(fragment));
    if (index) strncat(keys, " ", sizeof(keys) - strlen(keys) - 1);
    strncat(keys, fragment, sizeof(keys) - strlen(keys) - 1);
  }
  draw_compact_text(ctx, keys, 9, 151,
                    !s_razr && compact_text_width(keys, 2) <= 182 ? 2 : 1, ink);
  draw_keypad(ctx, ink, paper);
}

static void update_time(bool animate, bool hour_changed, const struct tm *tick_time) {
  time_t now = time(NULL);
  const struct tm *local = tick_time ? tick_time : localtime(&now);
  t9_make_time(local->tm_hour, local->tm_min, s_use_24h, s_use_oh_zero, &s_time);
  if (s_timer) {
    app_timer_cancel(s_timer);
    s_timer = NULL;
  }
  s_highlight_key = 0;
  s_token = 0;
  s_character = 0;
  s_showing_alternate = false;
  s_hour_changed = hour_changed;
  memset(s_hour_display, 0, sizeof(s_hour_display));
  memset(s_minute_display, 0, sizeof(s_minute_display));
  if (animate) {
    schedule_next(180);
  } else {
    for (int index = 0; index < s_time.hour_count; index++) {
      strncpy(s_hour_display[index], s_time.hour[index], 19);
    }
    for (int index = 0; index < s_time.minute_count; index++) {
      strncpy(s_minute_display[index], s_time.minute[index], 19);
    }
  }
  layer_mark_dirty(s_face);
}

static void on_tick(struct tm *tick, TimeUnits units) {
  update_time(true, tick->tm_min == 0, tick);
}

static void on_battery(BatteryChargeState charge) {
  (void)charge;
  layer_mark_dirty(s_face);
}

static bool read_color(Tuple *item, uint32_t *color, int storage_key) {
  if (!item || (item->type != TUPLE_INT && item->type != TUPLE_UINT)) return false;
  int32_t value = item->value->int32;
  if (value < 0 || value > 0xFFFFFF) return false;
  *color = (uint32_t)value;
  persist_write_int(storage_key, value);
  return true;
}

static void on_message(DictionaryIterator *iterator, void *context) {
  Tuple *format = dict_find(iterator, MESSAGE_KEY_TimeFormat);
  bool format_changed = false;
  if (format && (format->type == TUPLE_INT || format->type == TUPLE_UINT)) {
    int value = format->value->int32;
    if (value == 0 || value == 1) {
      s_use_24h = value == 1;
      persist_write_int(STORE_TIME_FORMAT, value);
      format_changed = true;
    }
  }
  Tuple *wording = dict_find(iterator, MESSAGE_KEY_ZeroWording);
  if (wording && (wording->type == TUPLE_INT || wording->type == TUPLE_UINT)) {
    int value = wording->value->int32;
    if (value == 0 || value == 1) {
      s_use_oh_zero = value == 1;
      persist_write_int(STORE_ZERO_WORDING, value);
      format_changed = true;
    }
  }
  bool color_changed = false;
  color_changed |= read_color(dict_find(iterator, MESSAGE_KEY_BackgroundColor),
                              &s_background_color, STORE_BACKGROUND_COLOR);
  color_changed |= read_color(dict_find(iterator, MESSAGE_KEY_TextColor),
                              &s_text_color, STORE_TEXT_COLOR);
  Tuple *model = dict_find(iterator, MESSAGE_KEY_PhoneModel);
  if (model && (model->type == TUPLE_INT || model->type == TUPLE_UINT)) {
    int value = model->value->int32;
    if (value == 0 || value == 1) {
      s_razr = value == 1;
      persist_write_int(STORE_PHONE_MODEL, value);
      color_changed = true;
    }
  }
  Tuple *battery = dict_find(iterator, MESSAGE_KEY_ShowBattery);
  if (battery && (battery->type == TUPLE_INT || battery->type == TUPLE_UINT)) {
    s_show_battery = battery->value->int32 != 0;
    persist_write_int(STORE_SHOW_BATTERY, s_show_battery ? 1 : 0);
    color_changed = true;
  }
  Tuple *model_colors = dict_find(iterator, MESSAGE_KEY_UseModelColors);
  if (model_colors && (model_colors->type == TUPLE_INT || model_colors->type == TUPLE_UINT)) {
    s_use_model_colors = model_colors->value->int32 != 0;
    persist_write_int(STORE_USE_MODEL_COLORS, s_use_model_colors ? 1 : 0);
    color_changed = true;
  }
  if (format_changed) update_time(false, false, NULL);
  else if (color_changed) layer_mark_dirty(s_face);
}

static void init(void) {
  s_use_24h = persist_exists(STORE_TIME_FORMAT) && persist_read_int(STORE_TIME_FORMAT) == 1;
  s_use_oh_zero = persist_exists(STORE_ZERO_WORDING) && persist_read_int(STORE_ZERO_WORDING) == 1;
  s_razr = persist_exists(STORE_PHONE_MODEL) && persist_read_int(STORE_PHONE_MODEL) == 1;
  s_show_battery = !persist_exists(STORE_SHOW_BATTERY) || persist_read_int(STORE_SHOW_BATTERY) == 1;
  s_background_color = DEFAULT_BACKGROUND_COLOR;
  s_text_color = DEFAULT_TEXT_COLOR;
  if (persist_exists(STORE_BACKGROUND_COLOR)) {
    int32_t value = persist_read_int(STORE_BACKGROUND_COLOR);
    if (value >= 0 && value <= 0xFFFFFF) s_background_color = (uint32_t)value;
  }
  if (persist_exists(STORE_TEXT_COLOR)) {
    int32_t value = persist_read_int(STORE_TEXT_COLOR);
    if (value >= 0 && value <= 0xFFFFFF) s_text_color = (uint32_t)value;
  }
  s_use_model_colors = persist_exists(STORE_USE_MODEL_COLORS) ?
    persist_read_int(STORE_USE_MODEL_COLORS) == 1 :
    (s_background_color == DEFAULT_BACKGROUND_COLOR && s_text_color == DEFAULT_TEXT_COLOR);
  s_window = window_create();
  window_set_background_color(s_window, GColorBlack);
  s_face = layer_create(GRect(0, 0, 200, 228));
  layer_set_update_proc(s_face, draw_face);
  layer_add_child(window_get_root_layer(s_window), s_face);
  window_stack_push(s_window, true);
  app_message_register_inbox_received(on_message);
  app_message_open(128, 64);
  battery_state_service_subscribe(on_battery);
  tick_timer_service_subscribe(MINUTE_UNIT, on_tick);
  update_time(true, true, NULL);
}

static void deinit(void) {
  tick_timer_service_unsubscribe();
  battery_state_service_unsubscribe();
  if (s_timer) app_timer_cancel(s_timer);
  app_message_deregister_callbacks();
  layer_destroy(s_face);
  window_destroy(s_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
