FROM alpine:3.20 AS build
RUN apk add --no-cache build-base cmake
WORKDIR /src
COPY . .
RUN cmake -S . -B build -DCMAKE_BUILD_TYPE=Release \
 && cmake --build build --target app --parallel

FROM alpine:3.20
WORKDIR /app
COPY --from=build /src/build/app /app/app
COPY public /app/public 2>/dev/null || true
COPY core/health-check.html /app/public/core/health-check.html
COPY registry /app/registry 2>/dev/null || true
ENV PORT=8080
EXPOSE 8080
CMD ["/app/app"]

