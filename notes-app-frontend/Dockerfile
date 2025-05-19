# --- Build Stage ---
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --force;

# Copy source files and build
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine AS runner

# Install tini for proper signal handling
RUN apk add --no-cache tini

# Set working directory
WORKDIR /app

# Copy only necessary production files
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && pnpm install --prod; \
  elif [ -f package-lock.json ]; then \
    npm ci --omit=dev; \
  else \
    npm install --omit=dev; \
  fi

# Copy built app and config
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV production

# Use tini as the init system
ENTRYPOINT ["/sbin/tini", "--"]

# Expose Next.js default port
EXPOSE 8080

# Start the app directly to ensure it receives shutdown signals
CMD ["node_modules/.bin/next", "start", "--port", "8080"]
