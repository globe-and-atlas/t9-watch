#pragma once
#include <stdbool.h>

static inline int t9_delay(int speed, int classic_ms) {
  return speed == 0 ? (classic_ms + 1) / 2 : speed == 2 ? classic_ms * 2 : classic_ms;
}

static inline bool t9_quiet(bool enabled, int start, int end, int hour) {
  if (!enabled) return false;
  if (start == end) return true;
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

static inline bool t9_show_guess(int mode, bool is_hour, bool hour_changed, int slot) {
  if (mode == 0) return false;
  if (mode == 2) return true;
  return is_hour ? hour_changed : slot % 3 == 0;
}
