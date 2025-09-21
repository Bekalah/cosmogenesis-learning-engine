cmake_minimum_required(VERSION 3.16)
project(cosmogenesis_engine_cpp)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(app
  main.cpp
  src/web/Server.hpp
  src/core/Models.hpp
  src/core/Resolver.hpp
  src/core/Registry.hpp
)

target_include_directories(app PRIVATE include src)

