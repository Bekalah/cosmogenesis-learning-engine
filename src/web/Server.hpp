#pragma once

#include "../../include/httplib.h"
#include "../../include/json.hpp"
#include "../core/Models.hpp"
#include "../core/Registry.hpp"
#include "../core/Resolver.hpp"

using json = nlohmann::json;

// Thin wrapper around the embedded httplib-compatible server.
class Server {
public:
  explicit Server(const Registry &registry) : reg_(registry) {
    // Lightweight ping used by Fly's health checks.
    api_.Get("/core/health-check.html", [](const httplib::Request &, httplib::Response &res) {
      res.set_content("ok", "text/html");
    });

    // Serve the static registry snapshot.
    api_.Get("/registry", [this](const httplib::Request &, httplib::Response &res) {
      if (!reg_.ok) {
        res.status = 503;
        res.set_content(R"({"error":"no_registry"})", "application/json");
        return;
      }
      res.set_content(reg_.root.dump(), "application/json");
    });

    // Deterministic resolver that maps input nodes to a worker id.
    api_.Post("/resolve", [](const httplib::Request &req, httplib::Response &res) {
      try {
        Node node = json::parse(req.body).get<Node>();
        const int id = Resolver{}.resolve(node);
        res.set_content(json{{"worker_id", id}, {"system", "raku-lite-cpp"}}.dump(),
                        "application/json");
      } catch (...) {
        res.status = 400;
        res.set_content(R"({"error":"bad_json"})", "application/json");
      }
    });

    api_.set_mount_point("/", "./public");
  }

  void listen(const char *host, int port) { api_.listen(host, port); }

private:
  const Registry &reg_;
  httplib::Server api_;
};

