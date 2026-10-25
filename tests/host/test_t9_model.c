#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#include "t9_model.h"

static void check_time(int hour, int minute, bool twenty_four,
                       const char *numeric, const char *hour_first,
                       const char *hour_second, const char *minute_first,
                       const char *minute_second) {
  T9Time value;
  t9_make_time(hour, minute, twenty_four, &value);
  assert(strcmp(value.numeric, numeric) == 0);
  assert(strcmp(value.hour[0], hour_first) == 0);
  assert(value.hour_count == (hour_second ? 2 : 1));
  if (hour_second) assert(strcmp(value.hour[1], hour_second) == 0);
  assert(strcmp(value.minute[0], minute_first) == 0);
  assert(value.minute_count == (minute_second ? 2 : 1));
  if (minute_second) assert(strcmp(value.minute[1], minute_second) == 0);
}

int main(void) {
  check_time(0, 0, false, "12:00", "TWELVE", NULL, "O'CLOCK", NULL);
  check_time(9, 5, false, "09:05", "NINE", NULL, "OH", "FIVE");
  check_time(9, 24, false, "09:24", "NINE", NULL, "TWENTY", "FOUR");
  check_time(12, 59, false, "12:59", "TWELVE", NULL, "FIFTY", "NINE");
  check_time(13, 17, false, "01:17", "ONE", NULL, "SEVENTEEN", NULL);
  check_time(0, 0, true, "00:00", "ZERO", NULL, "O'CLOCK", NULL);
  check_time(13, 17, true, "13:17", "THIRTEEN", NULL, "SEVENTEEN", NULL);
  check_time(23, 45, true, "23:45", "TWENTY", "THREE", "FORTY", "FIVE");

  for (int format = 0; format < 2; format++) {
    for (int hour = 0; hour < 24; hour++) {
      for (int minute = 0; minute < 60; minute++) {
      T9Time value;
      t9_make_time(hour, minute, format == 1, &value);
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
