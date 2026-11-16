#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#include "t9_model.h"
#include "t9_gesture.h"
#include "t9_policy.h"

static void check_time(int hour, int minute, bool twenty_four, bool oh_zero,
                       const char *numeric, const char *hour_first,
                       const char *hour_second, const char *minute_first,
                       const char *minute_second) {
  T9Time value;
  t9_make_time(hour, minute, twenty_four, oh_zero, &value);
  assert(strcmp(value.numeric, numeric) == 0);
  assert(strcmp(value.hour[0], hour_first) == 0);
  assert(value.hour_count == (hour_second ? 2 : 1));
  if (hour_second) assert(strcmp(value.hour[1], hour_second) == 0);
  assert(strcmp(value.minute[0], minute_first) == 0);
  assert(value.minute_count == (minute_second ? 2 : 1));
  if (minute_second) assert(strcmp(value.minute[1], minute_second) == 0);
}

int main(void) {
  unsigned count = 0;
  uint32_t previous = 0;
  assert(t9_count_knock(&count,&previous,1000)==1);
  assert(t9_count_knock(&count,&previous,1100)==0);
  assert(count==1);
  assert(t9_count_knock(&count,&previous,1300)==2);
  assert(t9_count_knock(&count,&previous,1600)==3);
  count=0;previous=0;
  assert(t9_count_knock(&count,&previous,1000)==1);
  assert(t9_count_knock(&count,&previous,1800)==1);
  assert(t9_count_knock(&count,&previous,2100)==2);
  count=1;previous=UINT32_MAX-100;
  assert(t9_count_knock(&count,&previous,200)==2);

  T9Knock knock = {0};
  assert(!t9_knock_sample(&knock, 0, 0, -1000, false, 2));
  assert(t9_knock_sample(&knock, 240, 0, -1000, false, 2));
  for (int i=0;i<6;i++) assert(!t9_knock_sample(&knock, i%2 ? 240 : -240, 0, -1000, false, 2));
  for (int i=0;i<20;i++) assert(!t9_knock_sample(&knock, 0, 0, -1000, false, 2));
  assert(t9_knock_sample(&knock, 240, 0, -1000, false, 2));
  assert(!t9_knock_sample(&knock, 0, 0, -4000, true, 2));
  assert(!t9_knock_sample(&knock, 0, 0, -1000, false, 2));
  for (int i=0;i<15;i++) assert(!t9_knock_sample(&knock, 0, 0, -1000, false, 2));
  assert(t9_knock_sample(&knock, 240, 0, -1000, false, 2));
  T9Knock firm = {0};
  assert(!t9_knock_sample(&firm, 0, 0, -1000, false, 0));
  assert(!t9_knock_sample(&firm, 240, 0, -1000, false, 0));
  assert(!t9_double_tap(0, 200));
  assert(!t9_double_tap(1000, 1100));
  assert(!t9_double_tap(1000, 1120));
  assert(t9_double_tap(1000, 1160));
  assert(t9_double_tap(1000, 1500));
  assert(t9_double_tap(1000, 1650));
  assert(t9_double_tap(1000, 1700));
  assert(!t9_double_tap(1000, 1701));
  assert(t9_double_tap(UINT32_MAX - 100, 200));

  assert(t9_delay(0, 105) == 53);
  assert(t9_delay(1, 105) == 105);
  assert(t9_delay(2, 105) == 210);
  for (int h = 0; h < 24; h++) {
    assert(!t9_quiet(false, 22, 7, h));
    assert(t9_quiet(true, 22, 7, h) == (h >= 22 || h < 7));
    assert(t9_quiet(true, 9, 17, h) == (h >= 9 && h < 17));
    assert(t9_quiet(true, 7, 7, h));
  }
  assert(!t9_show_guess(0, true, true, 3));
  assert(!t9_show_guess(0, false, false, 3));
  assert(t9_show_guess(2, true, false, 1));
  assert(t9_show_guess(2, false, false, 1));
  assert(t9_show_guess(1, true, true, 1));
  assert(!t9_show_guess(1, true, false, 3));
  assert(t9_show_guess(1, false, false, 3));
  assert(!t9_show_guess(1, false, false, 4));
  check_time(0, 0, false, false, "12:00", "TWELVE", NULL, "O'CLOCK", NULL);
  check_time(0, 0, false, true, "12:00", "TWELVE", NULL, "OH", "ZERO");
  check_time(0, 0, true, true, "00:00", "ZERO", NULL, "OH", "ZERO");
  check_time(9, 5, false, false, "09:05", "NINE", NULL, "OH", "FIVE");
  check_time(9, 5, false, true, "09:05", "NINE", NULL, "OH", "FIVE");
  check_time(9, 24, false, false, "09:24", "NINE", NULL, "TWENTY", "FOUR");
  check_time(12, 59, false, false, "12:59", "TWELVE", NULL, "FIFTY", "NINE");
  check_time(13, 17, false, false, "01:17", "ONE", NULL, "SEVENTEEN", NULL);
  check_time(0, 0, true, false, "00:00", "ZERO", NULL, "O'CLOCK", NULL);
  check_time(13, 17, true, false, "13:17", "THIRTEEN", NULL, "SEVENTEEN", NULL);
  check_time(23, 45, true, false, "23:45", "TWENTY", "THREE", "FORTY", "FIVE");

  for (int format = 0; format < 2; format++) {
    for (int hour = 0; hour < 24; hour++) {
      for (int minute = 0; minute < 60; minute++) {
      T9Time value;
      t9_make_time(hour, minute, format == 1, false, &value);
      assert(value.hour_count >= 1 && value.hour_count <= 2);
      assert(value.minute_count >= 1 && value.minute_count <= 2);
      for (int index = 0; index < value.hour_count; index++) {
        char keys[20];
        t9_keys_for_word(value.hour[index], keys, sizeof(keys));
        assert(strlen(keys) > 0);
      }
      for (int index = 0; index < value.minute_count; index++) {
        char keys[20];
        t9_keys_for_word(value.minute[index], keys, sizeof(keys));
        assert(strlen(keys) > 0);
      }
      }
    }
  }

  char keys[20];
  t9_keys_for_word("NINE", keys, sizeof(keys));
  assert(strcmp(keys, "6463") == 0);
  t9_keys_for_word("TWENTY", keys, sizeof(keys));
  assert(strcmp(keys, "893689") == 0);
  t9_keys_for_word("FOUR", keys, sizeof(keys));
  assert(strcmp(keys, "3687") == 0);
  t9_keys_for_word("O'CLOCK", keys, sizeof(keys));
  assert(strcmp(keys, "625625") == 0);

  const char *pairs[][2] = {
    {"NINE", "MINE"}, {"FIVE", "DIVE"}, {"THREE", "TIRED"},
    {"FOUR", "DOTS"}, {"ONE", "NOD"}
  };
  for (size_t index = 0; index < sizeof(pairs) / sizeof(pairs[0]); index++) {
    char first[20], second[20];
    assert(strcmp(t9_alternate(pairs[index][0]), pairs[index][1]) == 0);
    t9_keys_for_word(pairs[index][0], first, sizeof(first));
    t9_keys_for_word(pairs[index][1], second, sizeof(second));
    assert(strcmp(first, second) == 0);
  }
  puts("T9 model tests passed");
  return 0;
}
