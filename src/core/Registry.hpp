#pragma once

#include <fstream>
#include <string>

#include "../../include/json.hpp"

// Simple holder for the parsed registry payload.
struct Registry {
  nlohmann::json root;
  bool ok{false};
};

// Load JSON from disk, falling back to an empty registry when invalid.
inline Registry load_registry(const std::string &path) {
  Registry reg;
  std::ifstream file(path);
  if (file) {
    try {
      file >> reg.root;
      reg.ok = true;
    } catch (...) {
      reg.ok = false;
    }
  }
  return reg;
}

