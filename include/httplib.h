#pragma once

#include <algorithm>
#include <cerrno>
#include <cctype>
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <functional>
#include <map>
#include <netdb.h>
#include <sstream>
#include <stdexcept>
#include <string>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include <vector>

namespace httplib {

// Lightweight HTTP server facade compatible with the subset of
// cpp-httplib used by the engine. Implements only what the scroll
// needs: GET/POST routing, static mount points, and blocking listen.
struct Request {
  std::string method;
  std::string path;
  std::string body;
  std::map<std::string, std::string> headers;
};

struct Response {
  int status{200};
  std::string body;
  std::map<std::string, std::string> headers;

  void set_content(const std::string &value, const std::string &content_type) {
    body = value;
    headers["Content-Type"] = content_type;
  }

  void set_header(const std::string &key, const std::string &value) {
    headers[key] = value;
  }
};

using Handler = std::function<void(const Request &, Response &)>;

class Server {
public:
  Server() = default;
  ~Server() { stop(); }

  void Get(const std::string &pattern, Handler handler) {
    get_handlers_[pattern] = std::move(handler);
  }

  void Post(const std::string &pattern, Handler handler) {
    post_handlers_[pattern] = std::move(handler);
  }

  bool set_mount_point(const std::string &mount_point, const std::string &dir) {
    mount_point_ = mount_point;
    mount_dir_ = dir;
    return true;
  }

  bool listen(const char *host, int port) {
    addrinfo hints{};
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE;

    std::string port_str = std::to_string(port);
    addrinfo *res = nullptr;
    if (getaddrinfo(host, port_str.c_str(), &hints, &res) != 0) {
      return false;
    }

    int server_fd = -1;
    for (addrinfo *p = res; p != nullptr; p = p->ai_next) {
      server_fd = ::socket(p->ai_family, p->ai_socktype, p->ai_protocol);
      if (server_fd < 0) {
        continue;
      }
      int opt = 1;
      ::setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
      if (::bind(server_fd, p->ai_addr, p->ai_addrlen) == 0) {
        if (::listen(server_fd, 32) == 0) {
          break;
        }
      }
      ::close(server_fd);
      server_fd = -1;
    }
    freeaddrinfo(res);

    if (server_fd < 0) {
      return false;
    }

    server_fd_ = server_fd;
    running_ = true;

    while (running_) {
      sockaddr_storage client_addr{};
      socklen_t client_len = sizeof(client_addr);
      int client_fd = ::accept(server_fd_, reinterpret_cast<sockaddr *>(&client_addr), &client_len);
      if (client_fd < 0) {
        if (errno == EINTR) {
          continue;
        }
        break;
      }
      handle_client(client_fd);
      ::close(client_fd);
    }

    stop();
    return true;
  }

  void stop() {
    if (server_fd_ >= 0) {
      ::close(server_fd_);
      server_fd_ = -1;
    }
    running_ = false;
  }

private:
  struct ParsedRequest {
    Request request;
    size_t header_end{0};
    size_t content_length{0};
  };

  // Read, dispatch, and respond to a single connection.
  void handle_client(int client_fd) {
    std::string buffer;
    buffer.reserve(4096);

    ParsedRequest parsed;
    if (!read_request(client_fd, buffer, parsed)) {
      send_error(client_fd, 400, "Bad Request");
      return;
    }

    Response response;
    if (!dispatch(parsed.request, response)) {
      send_error(client_fd, response.status, response.body.empty() ? "Not Found" : response.body);
      return;
    }

    send_response(client_fd, response);
  }

  // Blocking read that collects the full request head and body.
  bool read_request(int client_fd, std::string &buffer, ParsedRequest &out) {
    char chunk[4096];
    ssize_t received = 0;
    size_t header_end = std::string::npos;
    size_t content_length = 0;

    while (true) {
      received = ::recv(client_fd, chunk, sizeof(chunk), 0);
      if (received < 0) {
        if (errno == EINTR) {
          continue;
        }
        return false;
      }
      if (received == 0) {
        break;
      }
      buffer.append(chunk, static_cast<size_t>(received));
      if (header_end == std::string::npos) {
        header_end = buffer.find("\r\n\r\n");
        if (header_end != std::string::npos) {
          content_length = extract_content_length(buffer.substr(0, header_end + 2));
        }
      }
      if (header_end != std::string::npos) {
        const size_t total_needed = header_end + 4 + content_length;
        if (buffer.size() >= total_needed) {
          break;
        }
      }
      if (static_cast<size_t>(received) < sizeof(chunk)) {
        break;
      }
    }

    if (buffer.empty()) {
      return false;
    }

    if (header_end == std::string::npos) {
      header_end = buffer.find("\r\n\r\n");
      if (header_end == std::string::npos) {
        return false;
      }
      content_length = extract_content_length(buffer.substr(0, header_end + 2));
    }

    if (buffer.size() < header_end + 4 + content_length) {
      return false;
    }

    out.header_end = header_end;
    out.content_length = content_length;
    return parse_request(buffer, out);
  }

  // Parse the request line and headers from the raw buffer.
  bool parse_request(const std::string &raw, ParsedRequest &out) {
    size_t line_end = raw.find("\r\n");
    if (line_end == std::string::npos) {
      return false;
    }

    std::string request_line = raw.substr(0, line_end);
    std::istringstream rl(request_line);
    std::string version;
    rl >> out.request.method >> out.request.path >> version;
    if (out.request.method.empty() || out.request.path.empty()) {
      return false;
    }

    size_t pos = line_end + 2;
    while (pos < out.header_end) {
      size_t next = raw.find("\r\n", pos);
      if (next == std::string::npos || next > out.header_end) {
        break;
      }
      std::string header_line = raw.substr(pos, next - pos);
      pos = next + 2;
      size_t colon = header_line.find(':');
      if (colon == std::string::npos) {
        continue;
      }
      std::string key = trim(header_line.substr(0, colon));
      std::string value = trim(header_line.substr(colon + 1));
      out.request.headers[key] = value;
    }

    out.request.body = raw.substr(out.header_end + 4, out.content_length);
    return true;
  }

  size_t extract_content_length(const std::string &headers) const {
    size_t pos = 0;
    while (pos < headers.size()) {
      size_t end = headers.find("\r\n", pos);
      if (end == std::string::npos) {
        end = headers.size();
      }
      std::string line = headers.substr(pos, end - pos);
      pos = end + 2;
      std::string key = line;
      auto colon = line.find(':');
      if (colon == std::string::npos) {
        continue;
      }
      key = trim(line.substr(0, colon));
      if (!case_insensitive_equal(key, "Content-Length")) {
        continue;
      }
      std::string value = trim(line.substr(colon + 1));
      return static_cast<size_t>(std::strtoull(value.c_str(), nullptr, 10));
    }
    return 0;
  }

  // Route requests to handlers or the static mount point.
  bool dispatch(const Request &request, Response &response) {
    const std::string path = strip_query(request.path);
    const auto *handlers = request.method == "POST" ? &post_handlers_ : &get_handlers_;
    auto it = handlers->find(path);
    if (it != handlers->end()) {
      it->second(request, response);
      ensure_default_headers(response);
      return true;
    }

    if (mount_point_.empty()) {
      response.status = 404;
      response.body = "not_found";
      return false;
    }

    if (path == mount_point_ || (mount_point_ == "/" && path == mount_point_)) {
      if (serve_file("index.html", response)) {
        ensure_default_headers(response);
        return true;
      }
      response.status = 404;
      response.body = "not_found";
      return false;
    }

    if (!mount_point_.empty()) {
      if (path.rfind(mount_point_, 0) == 0) {
        std::string relative = path.substr(mount_point_.size());
        if (!relative.empty() && relative.front() == '/') {
          relative.erase(relative.begin());
        }
        if (relative.empty()) {
          relative = "index.html";
        }
        if (relative.find("..") != std::string::npos) {
          response.status = 403;
          response.body = "forbidden";
          return false;
        }
        if (serve_file(relative, response)) {
          ensure_default_headers(response);
          return true;
        }
      }
    }

    response.status = 404;
    response.body = "not_found";
    return false;
  }

  // Load and return a static asset relative to the mount directory.
  bool serve_file(const std::string &relative_path, Response &response) {
    std::string full = mount_dir_;
    if (!full.empty() && full.back() != '/') {
      full.push_back('/');
    }
    full += relative_path;

    std::ifstream file(full, std::ios::binary);
    if (!file) {
      return false;
    }
    std::ostringstream buffer;
    buffer << file.rdbuf();
    response.body = buffer.str();
    response.status = 200;
    response.set_header("Content-Type", detect_mime(relative_path));
    return true;
  }

  // Guarantee a sane Content-Type when handlers omit one.
  void ensure_default_headers(Response &res) {
    if (!res.headers.count("Content-Type")) {
      res.headers["Content-Type"] = "text/plain";
    }
  }

  // Write the HTTP response back to the client socket.
  void send_response(int client_fd, const Response &res) {
    std::ostringstream builder;
    builder << "HTTP/1.1 " << res.status << ' ' << status_message(res.status) << "\r\n";
    for (const auto &entry : res.headers) {
      builder << entry.first << ": " << entry.second << "\r\n";
    }
    builder << "Content-Length: " << res.body.size() << "\r\n";
    builder << "Connection: close\r\n\r\n";
    builder << res.body;

    const std::string out = builder.str();
    size_t sent = 0;
    while (sent < out.size()) {
      ssize_t written = ::send(client_fd, out.data() + sent, out.size() - sent, 0);
      if (written <= 0) {
        break;
      }
      sent += static_cast<size_t>(written);
    }
  }

  // Helper for error replies.
  void send_error(int client_fd, int status, const std::string &message) {
    Response res;
    res.status = status;
    res.set_content(message, "text/plain");
    send_response(client_fd, res);
  }

  static std::string trim(const std::string &value) {
    size_t start = 0;
    while (start < value.size() && std::isspace(static_cast<unsigned char>(value[start]))) {
      start++;
    }
    size_t end = value.size();
    while (end > start && std::isspace(static_cast<unsigned char>(value[end - 1]))) {
      end--;
    }
    return value.substr(start, end - start);
  }

  static std::string strip_query(const std::string &path) {
    size_t q = path.find('?');
    if (q == std::string::npos) {
      return path;
    }
    return path.substr(0, q);
  }

  static bool case_insensitive_equal(const std::string &a, const std::string &b) {
    if (a.size() != b.size()) {
      return false;
    }
    for (size_t i = 0; i < a.size(); ++i) {
      if (std::tolower(static_cast<unsigned char>(a[i])) !=
          std::tolower(static_cast<unsigned char>(b[i]))) {
        return false;
      }
    }
    return true;
  }

  static std::string detect_mime(const std::string &path) {
    if (ends_with(path, ".html")) {
      return "text/html";
    }
    if (ends_with(path, ".css")) {
      return "text/css";
    }
    if (ends_with(path, ".js")) {
      return "application/javascript";
    }
    if (ends_with(path, ".json")) {
      return "application/json";
    }
    if (ends_with(path, ".txt")) {
      return "text/plain";
    }
    return "application/octet-stream";
  }

  static bool ends_with(const std::string &value, const std::string &suffix) {
    if (suffix.size() > value.size()) {
      return false;
    }
    return std::equal(suffix.rbegin(), suffix.rend(), value.rbegin(), value.rend(),
                      [](char a, char b) {
                        return std::tolower(static_cast<unsigned char>(a)) ==
                               std::tolower(static_cast<unsigned char>(b));
                      });
  }

  static std::string status_message(int status) {
    switch (status) {
      case 200: return "OK";
      case 201: return "Created";
      case 204: return "No Content";
      case 400: return "Bad Request";
      case 403: return "Forbidden";
      case 404: return "Not Found";
      case 500: return "Internal Server Error";
      case 503: return "Service Unavailable";
      default: return "OK";
    }
  }

  int server_fd_{-1};
  bool running_{false};
  std::map<std::string, Handler> get_handlers_;
  std::map<std::string, Handler> post_handlers_;
  std::string mount_point_{"/"};
  std::string mount_dir_{"."};
};

} // namespace httplib

