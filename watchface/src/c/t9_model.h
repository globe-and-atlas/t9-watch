#ifndef T9_MODEL_H
#define T9_MODEL_H

#include <stdbool.h>
#include <stddef.h>

typedef struct {
  const char *hour[2];
  const char *minute[2];
  int hour_count;
  int minute_count;
  char numeric[6];
} T9Time;

void t9_make_time(int hour, int minute, bool use_24h, T9Time *out);
int t9_key(char letter);
const char *t9_alternate(const char *word);
void t9_keys_for_word(const char *word, char *out, size_t capacity);

#endif
