FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/assets ./assets
COPY --from=build /app/registry ./registry

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.mjs"]
