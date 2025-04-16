# ================================
# Stage 1: Development / Build
# ================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN echo "📦 Installing build dependencies..." \
    && apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN echo "📥 Installing node modules..." \
    && npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN echo "🏗️  Building Next.js application..." \
    && npm run build


# ================================
# Stage 2: Production / Runner
# ================================
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Change ownership of the app files
RUN chown -R appuser:appgroup /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Set the user to non-root
USER appuser

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Metadata labels
LABEL maintainer="Shubham Tayde devshubh2204@gmail.com" \
      description="Production-ready Next.js application in Node 18 Alpine with non-root user" \
      version="1.0"

# Command to run the application
CMD ["node", "server.js"]

