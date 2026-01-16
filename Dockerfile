# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV DOCKER_BUILD=true
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Default nginx configuration is fine for standard SPA if not using client-side routing
# but since this might use client-side routing, a custom config would be better.
# For now, let's keep it simple.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
