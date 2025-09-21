#pragma once

#include <cctype>
#include <string>

#include "Models.hpp"

// Map alphabetic letters to their Pythagorean numbers.
inline int pythag_sum(const std::string &s) {
  int sum = 0;
  for (char c : s) {
    unsigned char u = static_cast<unsigned char>(c);
    char upper = static_cast<char>(std::toupper(u));
    if (upper >= 'A' && upper <= 'Z') {
      sum += (upper - 'A' + 1);
    }
  }
  return sum;
}

// Sum decimal digits embedded in the string.
inline int sum_digits(const std::string &s) {
  int sum = 0;
  for (char c : s) {
    if (std::isdigit(static_cast<unsigned char>(c))) {
      sum += (c - '0');
    }
  }
  return sum;
}

// Placeholder for a deterministic day-slot; safe default keeps index 0.
inline int day_mod_36(const std::string & /*iso*/) {
  return 0;
}

struct Resolver {
  int resolve(const Node &n) const {
    const int A = pythag_sum(n.title);
    const int B = sum_digits(n.arcana);
    const int C = day_mod_36(n.timestamp);
    const int score = 3 * A + 2 * B + 2 * (C * 2) + (n.seed % 72);
    return (score % 72) + 1;
  }
};

