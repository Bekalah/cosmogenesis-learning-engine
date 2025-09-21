#pragma once

#include <cctype>
#include <cmath>
#include <cstddef>
#include <initializer_list>
#include <istream>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>
#include <type_traits>
#include <utility>
#include <variant>
#include <vector>

namespace nlohmann {

// Minimal JSON value tree to keep the engine offline-friendly.
// Supports the subset of nlohmann::json needed for registry loading
// and the /resolve payloads without external dependencies.
class json {
public:
  using object_t = std::map<std::string, json>;
  using array_t = std::vector<json>;
  using string_t = std::string;
  using boolean_t = bool;
  using number_t = double;

  json() : data_(nullptr) {}
  json(std::nullptr_t) : data_(nullptr) {}
  json(boolean_t value) : data_(value) {}
  json(int value) : data_(static_cast<number_t>(value)) {}
  json(long value) : data_(static_cast<number_t>(value)) {}
  json(long long value) : data_(static_cast<number_t>(value)) {}
  json(unsigned value) : data_(static_cast<number_t>(value)) {}
  json(unsigned long value) : data_(static_cast<number_t>(value)) {}
  json(unsigned long long value) : data_(static_cast<number_t>(value)) {}
  json(number_t value) : data_(value) {}
  json(const char *value) : data_(string_t(value ? value : "")) {}
  json(const string_t &value) : data_(value) {}
  json(string_t &&value) : data_(std::move(value)) {}
  json(const array_t &value) : data_(value) {}
  json(array_t &&value) : data_(std::move(value)) {}
  json(const object_t &value) : data_(value) {}
  json(object_t &&value) : data_(std::move(value)) {}

  json(std::initializer_list<std::pair<const std::string, json>> init)
      : data_(object_t{}) {
    object_t &obj = std::get<object_t>(data_);
    for (const auto &item : init) {
      obj[item.first] = item.second;
    }
  }

  static json array(std::initializer_list<json> init = {}) {
    return json(array_t(init));
  }

  bool is_null() const { return std::holds_alternative<std::nullptr_t>(data_); }
  bool is_boolean() const { return std::holds_alternative<boolean_t>(data_); }
  bool is_number() const { return std::holds_alternative<number_t>(data_); }
  bool is_string() const { return std::holds_alternative<string_t>(data_); }
  bool is_array() const { return std::holds_alternative<array_t>(data_); }
  bool is_object() const { return std::holds_alternative<object_t>(data_); }

  size_t size() const {
    if (is_object()) {
      return std::get<object_t>(data_).size();
    }
    if (is_array()) {
      return std::get<array_t>(data_).size();
    }
    return 0;
  }

  bool contains(const std::string &key) const {
    if (!is_object()) {
      return false;
    }
    const auto &obj = std::get<object_t>(data_);
    return obj.find(key) != obj.end();
  }

  const json &operator[](const std::string &key) const {
    if (!is_object()) {
      throw std::out_of_range("json: not an object");
    }
    const auto &obj = std::get<object_t>(data_);
    auto it = obj.find(key);
    if (it == obj.end()) {
      throw std::out_of_range("json: key not found");
    }
    return it->second;
  }

  json &operator[](const std::string &key) {
    if (!is_object()) {
      data_ = object_t{};
    }
    auto &obj = std::get<object_t>(data_);
    return obj[key];
  }

  const json &operator[](size_t index) const {
    if (!is_array()) {
      throw std::out_of_range("json: not an array");
    }
    const auto &arr = std::get<array_t>(data_);
    if (index >= arr.size()) {
      throw std::out_of_range("json: index out of range");
    }
    return arr[index];
  }

  json &operator[](size_t index) {
    if (!is_array()) {
      throw std::out_of_range("json: not an array");
    }
    auto &arr = std::get<array_t>(data_);
    if (index >= arr.size()) {
      throw std::out_of_range("json: index out of range");
    }
    return arr[index];
  }

  template <typename T>
  T get() const {
    if constexpr (std::is_same_v<T, json>) {
      return *this;
    } else if constexpr (std::is_same_v<T, string_t>) {
      if (is_string()) {
        return std::get<string_t>(data_);
      }
      if (is_number()) {
        number_t n = std::get<number_t>(data_);
        string_t out;
        if (std::floor(n) == n) {
          out = std::to_string(static_cast<long long>(n));
        } else {
          out = std::to_string(n);
        }
        return out;
      }
      if (is_boolean()) {
        return std::get<boolean_t>(data_) ? "true" : "false";
      }
      return string_t{};
    } else if constexpr (std::is_same_v<T, int>) {
      if (is_number()) {
        return static_cast<int>(std::get<number_t>(data_));
      }
      if (is_string()) {
        return std::stoi(std::get<string_t>(data_));
      }
      return 0;
    } else if constexpr (std::is_same_v<T, long>) {
      if (is_number()) {
        return static_cast<long>(std::get<number_t>(data_));
      }
      if (is_string()) {
        return std::stol(std::get<string_t>(data_));
      }
      return 0;
    } else if constexpr (std::is_same_v<T, long long>) {
      if (is_number()) {
        return static_cast<long long>(std::get<number_t>(data_));
      }
      if (is_string()) {
        return std::stoll(std::get<string_t>(data_));
      }
      return 0;
    } else if constexpr (std::is_same_v<T, double>) {
      if (is_number()) {
        return std::get<number_t>(data_);
      }
      if (is_string()) {
        return std::stod(std::get<string_t>(data_));
      }
      return 0.0;
    } else if constexpr (std::is_same_v<T, bool>) {
      if (is_boolean()) {
        return std::get<boolean_t>(data_);
      }
      if (is_string()) {
        const auto &s = std::get<string_t>(data_);
        return s == "true" || s == "1";
      }
      return false;
    } else if constexpr (std::is_same_v<T, array_t>) {
      if (!is_array()) {
        return array_t{};
      }
      return std::get<array_t>(data_);
    } else if constexpr (std::is_same_v<T, object_t>) {
      if (!is_object()) {
        return object_t{};
      }
      return std::get<object_t>(data_);
    } else {
      static_assert(sizeof(T) == 0, "json::get not implemented for type");
    }
  }

  template <typename T>
  T value(const std::string &key, const T &default_value) const {
    if (!is_object()) {
      return default_value;
    }
    const auto &obj = std::get<object_t>(data_);
    auto it = obj.find(key);
    if (it == obj.end()) {
      return default_value;
    }
    return it->second.get<T>();
  }

  const string_t &get_string_ref() const {
    if (!is_string()) {
      throw std::runtime_error("json: not a string");
    }
    return std::get<string_t>(data_);
  }

  string_t dump(int indent = -1) const {
    std::string out;
    dump_impl(out, indent, 0);
    return out;
  }

  static json parse(const string_t &text) {
    Parser p(text);
    json value = p.parse_value();
    p.skip_ws();
    if (!p.at_end()) {
      throw std::runtime_error("json parse error: trailing data");
    }
    return value;
  }

  static json parse(std::istream &stream) {
    std::ostringstream buffer;
    buffer << stream.rdbuf();
    return parse(buffer.str());
  }

private:
  struct Parser {
    // Tiny recursive-descent parser for the subset of JSON we consume.
    explicit Parser(const std::string &text) : text(text), index(0) {}

    json parse_value() {
      skip_ws();
      if (at_end()) {
        throw std::runtime_error("json parse error: unexpected end of input");
      }
      char ch = text[index];
      if (ch == '"') {
        return json(parse_string());
      }
      if (ch == '{') {
        return parse_object();
      }
      if (ch == '[') {
        return parse_array();
      }
      if (ch == 't') {
        consume_literal("true");
        return json(true);
      }
      if (ch == 'f') {
        consume_literal("false");
        return json(false);
      }
      if (ch == 'n') {
        consume_literal("null");
        return json(nullptr);
      }
      return json(parse_number());
    }

    json parse_object() {
      object_t result;
      expect('{');
      skip_ws();
      if (match('}')) {
        return json(result);
      }
      while (true) {
        skip_ws();
        if (!match('"')) {
          throw std::runtime_error("json parse error: expected string key");
        }
        string_t key = parse_string_body();
        skip_ws();
        expect(':');
        json value = parse_value();
        result.emplace(std::move(key), std::move(value));
        skip_ws();
        if (match('}')) {
          break;
        }
        expect(',');
      }
      return json(result);
    }

    json parse_array() {
      array_t result;
      expect('[');
      skip_ws();
      if (match(']')) {
        return json(result);
      }
      while (true) {
        result.emplace_back(parse_value());
        skip_ws();
        if (match(']')) {
          break;
        }
        expect(',');
      }
      return json(result);
    }

    std::string parse_string() {
      expect('"');
      return parse_string_body();
    }

    std::string parse_string_body() {
      std::string result;
      while (!at_end()) {
        char ch = text[index++];
        if (ch == '"') {
          return result;
        }
        if (ch == '\\') {
          if (at_end()) {
            throw std::runtime_error("json parse error: invalid escape");
          }
          char esc = text[index++];
          switch (esc) {
            case '\"': result.push_back('"'); break;
            case '\\': result.push_back('\\'); break;
            case '/': result.push_back('/'); break;
            case 'b': result.push_back('\b'); break;
            case 'f': result.push_back('\f'); break;
            case 'n': result.push_back('\n'); break;
            case 'r': result.push_back('\r'); break;
            case 't': result.push_back('\t'); break;
            default:
              throw std::runtime_error("json parse error: unsupported escape");
          }
        } else {
          result.push_back(ch);
        }
      }
      throw std::runtime_error("json parse error: unterminated string");
    }

    double parse_number() {
      size_t start = index;
      if (text[index] == '-') {
        index++;
      }
      while (!at_end() && std::isdigit(static_cast<unsigned char>(text[index]))) {
        index++;
      }
      if (!at_end() && text[index] == '.') {
        index++;
        while (!at_end() && std::isdigit(static_cast<unsigned char>(text[index]))) {
          index++;
        }
      }
      if (!at_end() && (text[index] == 'e' || text[index] == 'E')) {
        index++;
        if (!at_end() && (text[index] == '+' || text[index] == '-')) {
          index++;
        }
        while (!at_end() && std::isdigit(static_cast<unsigned char>(text[index]))) {
          index++;
        }
      }
      double value = std::stod(text.substr(start, index - start));
      return value;
    }

    void expect(char expected) {
      if (at_end() || text[index] != expected) {
        throw std::runtime_error("json parse error: unexpected character");
      }
      index++;
    }

    bool match(char expected) {
      if (!at_end() && text[index] == expected) {
        index++;
        return true;
      }
      return false;
    }

    void consume_literal(const char *literal) {
      while (*literal) {
        if (at_end() || text[index] != *literal) {
          throw std::runtime_error("json parse error: unexpected literal");
        }
        index++;
        literal++;
      }
    }

    void skip_ws() {
      while (!at_end() && std::isspace(static_cast<unsigned char>(text[index]))) {
        index++;
      }
    }

    bool at_end() const { return index >= text.size(); }

    const std::string &text;
    size_t index;
  };

  // Serialise recursively with optional indentation.
  void dump_impl(std::string &out, int indent, int depth) const {
    if (is_null()) {
      out += "null";
      return;
    }
    if (is_boolean()) {
      out += std::get<boolean_t>(data_) ? "true" : "false";
      return;
    }
    if (is_number()) {
      number_t value = std::get<number_t>(data_);
      if (std::isfinite(value)) {
        std::ostringstream oss;
        oss.precision(15);
        oss << value;
        out += oss.str();
      } else {
        out += "0";
      }
      return;
    }
    if (is_string()) {
      out.push_back('"');
      const auto &str = std::get<string_t>(data_);
      for (char ch : str) {
        switch (ch) {
          case '\"': out += "\\\""; break;
          case '\\': out += "\\\\"; break;
          case '\b': out += "\\b"; break;
          case '\f': out += "\\f"; break;
          case '\n': out += "\\n"; break;
          case '\r': out += "\\r"; break;
          case '\t': out += "\\t"; break;
          default:
            out.push_back(ch);
        }
      }
      out.push_back('"');
      return;
    }
    if (is_array()) {
      const auto &arr = std::get<array_t>(data_);
      out.push_back('[');
      if (!arr.empty()) {
        for (size_t i = 0; i < arr.size(); ++i) {
          if (indent >= 0) {
            out.push_back('\n');
            out.append(static_cast<size_t>(indent) * static_cast<size_t>(depth + 1), ' ');
          }
          arr[i].dump_impl(out, indent, depth + 1);
          if (i + 1 < arr.size()) {
            out.push_back(',');
            if (indent < 0) {
              out.push_back(' ');
            }
          }
        }
        if (indent >= 0) {
          out.push_back('\n');
          out.append(static_cast<size_t>(indent) * static_cast<size_t>(depth), ' ');
        }
      }
      out.push_back(']');
      return;
    }
    if (is_object()) {
      const auto &obj = std::get<object_t>(data_);
      out.push_back('{');
      if (!obj.empty()) {
        size_t index = 0;
        for (const auto &entry : obj) {
          if (indent >= 0) {
            out.push_back('\n');
            out.append(static_cast<size_t>(indent) * static_cast<size_t>(depth + 1), ' ');
          }
          json(entry.first).dump_impl(out, indent, depth + 1);
          out.push_back(':');
          if (indent >= 0) {
            out.push_back(' ');
          }
          entry.second.dump_impl(out, indent, depth + 1);
          if (index + 1 < obj.size()) {
            out.push_back(',');
            if (indent < 0) {
              out.push_back(' ');
            }
          }
          index++;
        }
        if (indent >= 0) {
          out.push_back('\n');
          out.append(static_cast<size_t>(indent) * static_cast<size_t>(depth), ' ');
        }
      }
      out.push_back('}');
    }
  }

  std::variant<std::nullptr_t, boolean_t, number_t, string_t, array_t, object_t> data_;
};

inline std::istream &operator>>(std::istream &stream, json &value) {
  value = json::parse(stream);
  return stream;
}

} // namespace nlohmann

