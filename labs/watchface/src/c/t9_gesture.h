#pragma once
#include <stdbool.h>
#include <stdint.h>
static inline bool t9_double_tap(uint32_t previous, uint32_t now) {
  uint32_t elapsed = now - previous;
  return previous != 0 && elapsed >= 160 && elapsed <= 700;
}

/* Returns accepted sequence length, or zero for bounce. The caller delays
 * the double action until its timer expires, so a third tap cannot show Weather. */
static inline unsigned t9_count_knock(unsigned *count, uint32_t *previous, uint32_t now) {
  uint32_t elapsed = now - *previous;
  if (*count && elapsed < 160) return 0;
  if (!*count || elapsed > 700) *count = 1;
  else (*count)++;
  *previous = now;
  return *count;
}

/* Detect a brief acceleration relative to gravity, including sideways/light taps.
 * Rearm only after quiet samples and a 160ms refractory period; reject ringing. */
typedef struct {
  bool initialized;
  bool armed;
  int32_t baseline[3];
  uint8_t quiet;
  uint8_t refractory;
} T9Knock;

static inline bool t9_knock_sample(T9Knock *state, int16_t x, int16_t y,
                                   int16_t z, bool vibrating, int sensitivity) {
  if (vibrating) {
    state->initialized = false;
    state->armed = false;
    state->quiet = 0;
    state->refractory = 10;
    return false;
  }
  int32_t sample[3] = {x,y,z};
  if (!state->initialized) {
    for (int i=0;i<3;i++) state->baseline[i]=sample[i];
    state->initialized=true;
    state->armed=state->refractory==0;
    return false;
  }
  int threshold = sensitivity == 2 ? 150 : sensitivity == 0 ? 450 : 250;
  int32_t energy=0;
  for (int i=0;i<3;i++) {
    int32_t delta=sample[i]-state->baseline[i];
    energy+=delta*delta;
    state->baseline[i]+=delta/8;
  }
  if (state->refractory) state->refractory--;
  if (energy < (threshold/2)*(threshold/2)) {
    if (state->quiet<3) state->quiet++;
    if (state->quiet==3 && !state->refractory) state->armed=true;
  } else state->quiet=0;
  if (state->armed && !state->refractory && energy>threshold*threshold) {
    state->armed=false;
    state->quiet=0;
    state->refractory=8;
    return true;
  }
  return false;
}
