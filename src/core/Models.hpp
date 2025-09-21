#pragma once

#include <string>

#include "../../include/json.hpp"

// Canonical request payload for the resolver.
struct Node {
  std::string title;
  std::string arcana;
  int seed{33};
  std::string timestamp;
};

// Example worker metadata preserved for lore completeness.
struct Worker {
  int id{1};
  std::string name{"Vehuiyah"};
  std::string ratio{"3:2"};
  std::string tone{"C#"};
};

inline void to_json(nlohmann::json &j, const Node &n) {
  j = {{"title", n.title}, {"arcana", n.arcana}, {"seed", n.seed}, {"timestamp", n.timestamp}};
}

inline void from_json(const nlohmann::json &j, Node &n) {
  n.title = j.value<std::string>("title", "");
  n.arcana = j.value<std::string>("arcana", "0");
  n.seed = j.value<int>("seed", 33);
  n.timestamp = j.value<std::string>("timestamp", "");
}

namespace nlohmann {

template <> inline Node json::get<Node>() const {
  Node n;
  if (is_object()) {
    n.title = value<std::string>("title", "");
    n.arcana = value<std::string>("arcana", "0");
    n.seed = value<int>("seed", 33);
    n.timestamp = value<std::string>("timestamp", "");
  }
  return n;
}

} // namespace nlohmann

