#include "t9_model.h"

#include <stdio.h>
#include <string.h>

static const char *const ONES[] = {
  "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"
};
static const char *const TEENS[] = {
  "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN",
  "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
};
static const char *const TENS[] = {"", "", "TWENTY", "THIRTY", "FORTY", "FIFTY"};

static int words_for_number(int value, const char **words) {
  if (value < 10) {
    words[0] = ONES[value];
    return 1;
  }
  if (value < 20) {
    words[0] = TEENS[value - 10];
    return 1;
  }
  words[0] = TENS[value / 10];
  if (value % 10) {
    words[1] = ONES[value % 10];
    return 2;
  }
  return 1;
}

void t9_make_time(int hour, int minute, bool use_24h, T9Time *out) {
  memset(out, 0, sizeof(*out));
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return;

  int shown_hour = use_24h ? hour : ((hour + 11) % 12) + 1;
  out->hour_count = words_for_number(shown_hour, out->hour);
  if (minute == 0) {
    out->minute[0] = "O'CLOCK";
    out->minute_count = 1;
  } else if (minute < 10) {
    out->minute[0] = "OH";
    out->minute[1] = ONES[minute];
    out->minute_count = 2;
  } else {
    out->minute_count = words_for_number(minute, out->minute);
  }
  snprintf(out->numeric, sizeof(out->numeric), "%02d:%02d", shown_hour, minute);
}

int t9_key(char letter) {
  if (letter >= 'A' && letter <= 'C') return 2;
  if (letter >= 'D' && letter <= 'F') return 3;
  if (letter >= 'G' && letter <= 'I') return 4;
  if (letter >= 'J' && letter <= 'L') return 5;
  if (letter >= 'M' && letter <= 'O') return 6;
  if (letter >= 'P' && letter <= 'S') return 7;
  if (letter >= 'T' && letter <= 'V') return 8;
  if (letter >= 'W' && letter <= 'Z') return 9;
  return 0;
}

const char *t9_alternate(const char *word) {
  if (strcmp(word, "NINE") == 0) return "MINE";
  if (strcmp(word, "FIVE") == 0) return "DIVE";
  if (strcmp(word, "THREE") == 0) return "TIRED";
  if (strcmp(word, "FOUR") == 0) return "DOTS";
  if (strcmp(word, "ONE") == 0) return "NOD";
  return NULL;
}

void t9_keys_for_word(const char *word, char *out, size_t capacity) {
  if (capacity == 0) return;
  size_t used = 0;
  while (*word && used + 1 < capacity) {
    int key = t9_key(*word++);
    if (key) out[used++] = (char)('0' + key);
  }
  out[used] = '\0';
}
