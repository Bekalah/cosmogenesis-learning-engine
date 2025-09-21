#include "src/core/Registry.hpp"
#include "src/web/Server.hpp"

#include <iostream>

int main() {
  // Load the registry once and host the static geometry endpoints.
  Registry registry = load_registry("./registry/universal.json");
  if (!registry.ok) {
    std::cerr << "[warn] registry/universal.json not found or invalid; /registry -> 503\n";
  }
  Server server(registry);
  server.listen("0.0.0.0", 8080);
  return 0;
}

