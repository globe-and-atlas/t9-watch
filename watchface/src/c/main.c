#include <pebble.h>
#include <stdio.h>
#include <string.h>

#include "t9_model.h"

#define STORE_TIME_FORMAT 1
#define STORE_BACKGROUND_COLOR 2
#define STORE_TEXT_COLOR 3
#define DEFAULT_BACKGROUND_COLOR 0xAAFFAA
#define DEFAULT_TEXT_COLOR 0x000000
#define STEP_MS 105

static Window *s_window;
static Layer *s_face;
static AppTimer *s_timer;
static T9Time s_time;
static bool s_use_24h;
static uint32_t s_background_color;
static uint32_t s_text_color;
static bool s_hour_changed;
static char s_hour_display[2][20];
static char s_minute_display[2][20];
static int s_token;
static int s_character;
static int s_highlight_key;
static bool s_showing_alternate;

static const uint8_t GLYPHS[36][7] = {
  {14,17,17,31,17,17,17}, {30,17,17,30,17,17,30},
  {14,17,16,16,16,17,14}, {30,17,17,17,17,17,30},
  {31,16,16,30,16,16,31}, {31,16,16,30,16,16,16},
  {14,17,16,23,17,17,15}, {17,17,17,31,17,17,17},
  {31,4,4,4,4,4,31}, {7,2,2,2,18,18,12},
  {17,18,20,24,20,18,17}, {16,16,16,16,16,16,31},
  {17,27,21,21,17,17,17}, {17,25,21,19,17,17,17},
  {14,17,17,17,17,17,14}, {30,17,17,30,16,16,16},
  {14,17,17,17,21,18,13}, {30,17,17,30,20,18,17},
  {15,16,16,14,1,1,30}, {31,4,4,4,4,4,4},
  {17,17,17,17,17,17,14}, {17,17,17,17,17,10,4},
  {17,17,17,21,21,21,10}, {17,17,10,4,10,17,17},
  {17,17,10,4,4,4,4}, {31,1,2,4,8,16,31},
  {14,17,19,21,25,17,14}, {4,12,4,4,4,4,14},
  {14,17,1,2,4,8,31}, {30,1,1,14,1,1,30},
  {2,6,10,18,31,2,2}, {31,16,16,30,1,1,30},
  {14,16,16,30,17,17,14}, {31,1,2,4,8,8,8},
  {14,17,17,14,17,17,14}, {14,17,17,15,1,1,14}
};

static int glyph_index(char c) {
  if (c >= 'A' && c <= 'Z') return c - 'A';
  if (c >= '0' && c <= '9') return 26 + c - '0';
  return -1;
}

static int text_width(const char *text, int scale) {
  int count = (int)strlen(text);
  return count ? count * 6 * scale - scale : 0;
}

static void draw_text(GContext *ctx, const char *text, int x, int y, int scale,
                      GColor color) {
  graphics_context_set_fill_color(ctx, color);
  for (; *text; text++, x += 6 * scale) {
    if (*text == ':') {
      graphics_fill_rect(ctx, GRect(x + 2 * scale, y + 2 * scale, scale, scale), 0, GCornerNone);
      graphics_fill_rect(ctx, GRect(x + 2 * scale, y + 5 * scale, scale, scale), 0, GCornerNone);
      continue;
    }
    if (*text == '\'') {
      graphics_fill_rect(ctx, GRect(x + 2 * scale, y, scale, 2 * scale), 0, GCornerNone);
      continue;
    }
    int index = glyph_index(*text);
    if (index < 0) continue;
    for (int row = 0; row < 7; row++) {
      for (int column = 0; column < 5; column++) {
        if (GLYPHS[index][row] & (1 << (4 - column))) {
          graphics_fill_rect(ctx, GRect(x + column * scale, y + row * scale,
                                        scale, scale), 0, GCornerNone);
        }
      }
    }
  }
}

static void draw_keypad(GContext *ctx, GColor ink, GColor paper) {
  static const char *const LABELS[12] = {
    "1", "2 ABC", "3 DEF", "4 GHI", "5 JKL", "6 MNO",
    "7 PQRS", "8 TUV", "9 WXYZ", "*", "0", "#"
  };
  for (int key = 0; key < 12; key++) {
    int x = 9 + (key % 3) * 62;
    int y = 168 + (key / 3) * 15;
    bool active = key < 9 && s_highlight_key == key + 1;
    GRect box = GRect(x, y, 58, 13);
    graphics_context_set_fill_color(ctx, active ? ink : paper);
    graphics_fill_rect(ctx, box, 0, GCornerNone);
    graphics_context_set_stroke_color(ctx, ink);
    graphics_draw_rect(ctx, box);
    int width = text_width(LABELS[key], 1);
    draw_text(ctx, LABELS[key], x + (58 - width) / 2, y + 3, 1, active ? paper : ink);
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
  GColor paper = GColorFromHEX(s_background_color);
  GColor ink = GColorFromHEX(s_text_color);
  graphics_context_set_fill_color(ctx, paper);
  graphics_fill_rect(ctx, bounds, 0, GCornerNone);

  draw_text(ctx, s_time.numeric, 200 - 9 - text_width(s_time.numeric, 3), 7, 3, ink);
  graphics_context_set_stroke_color(ctx, ink);
  graphics_draw_line(ctx, GPoint(9, 33), GPoint(190, 33));
  draw_text(ctx, "HOUR", 9, 39, 1, ink);

  char hour_line[40];
  combine_hour(hour_line, sizeof(hour_line));
  int hour_scale = text_width(hour_line, 3) <= 182 ? 3 : 2;
  draw_text(ctx, hour_line, 9, 51, hour_scale, ink);

  const char *first = s_minute_display[0];
  const char *second = s_minute_display[1];
  int first_scale = text_width(first, 4) <= 182 ? 4 : 3;
  int second_scale = text_width(second, 4) <= 182 ? 4 : 3;
  if (s_time.minute_count == 1) {
    draw_text(ctx, first, 9, 91, first_scale, ink);
  } else {
    draw_text(ctx, first, 9, 80, first_scale, ink);
    draw_text(ctx, second, 9, 111, second_scale, ink);
  }
  if (s_timer && s_token < s_time.hour_count + s_time.minute_count) {
    int cursor_x;
    int cursor_y;
    int cursor_width;
    if (s_token < s_time.hour_count) {
      cursor_x = 9 + (int)strlen(hour_line) * 6 * hour_scale;
      cursor_y = 51 + 7 * hour_scale - 3;
      cursor_width = 5 * hour_scale;
    } else {
      int minute_index = s_token - s_time.hour_count;
      const char *shown = minute_index == 0 ? first : second;
      int scale = minute_index == 0 ? first_scale : second_scale;
      cursor_x = 9 + (int)strlen(shown) * 6 * scale;
      cursor_y = (s_time.minute_count == 1 ? 91 : (minute_index == 0 ? 80 : 111)) + 7 * scale - 3;
      cursor_width = 5 * scale;
    }
    graphics_context_set_fill_color(ctx, ink);
    graphics_fill_rect(ctx, GRect(cursor_x, cursor_y, cursor_width, 3), 0, GCornerNone);
  }
  draw_text(ctx, "MINUTE", 9, 142, 1, ink);

  char keys[36] = "";
  char fragment[20];
  for (int index = 0; index < s_time.minute_count; index++) {
    t9_keys_for_word(s_time.minute[index], fragment, sizeof(fragment));
    if (index) strncat(keys, " ", sizeof(keys) - strlen(keys) - 1);
    strncat(keys, fragment, sizeof(keys) - strlen(keys) - 1);
  }
  draw_text(ctx, keys, 9, 151, text_width(keys, 2) <= 182 ? 2 : 1, ink);
  draw_keypad(ctx, ink, paper);
}

static void update_time(bool animate, bool hour_changed, const struct tm *tick_time) {
  time_t now = time(NULL);
  const struct tm *local = tick_time ? tick_time : localtime(&now);
  t9_make_time(local->tm_hour, local->tm_min, s_use_24h, &s_time);
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
  bool color_changed = false;
  color_changed |= read_color(dict_find(iterator, MESSAGE_KEY_BackgroundColor),
                              &s_background_color, STORE_BACKGROUND_COLOR);
  color_changed |= read_color(dict_find(iterator, MESSAGE_KEY_TextColor),
                              &s_text_color, STORE_TEXT_COLOR);
  if (format_changed) update_time(false, false, NULL);
  else if (color_changed) layer_mark_dirty(s_face);
}

static void init(void) {
  s_use_24h = persist_exists(STORE_TIME_FORMAT) && persist_read_int(STORE_TIME_FORMAT) == 1;
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
  s_window = window_create();
  window_set_background_color(s_window, GColorBlack);
  s_face = layer_create(GRect(0, 0, 200, 228));
  layer_set_update_proc(s_face, draw_face);
  layer_add_child(window_get_root_layer(s_window), s_face);
  window_stack_push(s_window, true);
  app_message_register_inbox_received(on_message);
  app_message_open(128, 64);
  tick_timer_service_subscribe(MINUTE_UNIT, on_tick);
  update_time(true, true, NULL);
}

static void deinit(void) {
  tick_timer_service_unsubscribe();
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
