FROM --platform=linux/amd64 node:20-alpine

# Add build arguments for Node with adjusted memory settings
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NODE_ENV=production
# Add timeout configuration for the server
ENV SERVER_TIMEOUT="60s"
# Set logging level to only show warnings and errors
ENV LOG_LEVEL="warn"

# Add additional system packages
RUN apk add --no-cache wget

WORKDIR /app

# Copy package files for both frontend and backend
COPY frontend/package*.json frontend/
COPY backend/package*.json backend/

ENV DEV=FALSE
# Install dependencies for both projects with clean npm cache and platform-specific handling
# Note: Manual installation of platform-specific optional dependencies is required due to npm bug
# with optional dependencies during cross-compilation (https://github.com/npm/cli/issues/4828)
RUN cd frontend && npm cache clean --force && \
    rm -rf node_modules/.cache && \
    npm ci && \
    npm install --no-save @rollup/rollup-linux-x64-musl@4.53.3 @esbuild/linux-x64@0.25.12
RUN cd backend && npm cache clean --force && \
    npm ci --platform=linux --arch=x64 && \
    npm rebuild --platform=linux --arch=x64 && \
    echo "DEV=false" > .env

# Copy source code for both projects
COPY frontend/ frontend/
COPY backend/ backend/

# Build frontend and move to backend/static
RUN cd frontend && npm run build
RUN mkdir -p backend/static
RUN cp -r frontend/dist/* backend/static/

# Build backend
WORKDIR /app/backend
RUN apk add --no-cache sed && \
    sed -i 's/DEV=.*$/DEV=false/' .env && \
    npm run build

# Clean up frontend files and development dependencies
RUN rm -rf /app/frontend
RUN npm prune --production

# Modify healthcheck for faster initial checks
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

# Adjust node memory limits for Cloud Run environment
CMD ["node", "--max-old-space-size=1024", "dist/server.js"] 