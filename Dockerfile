# Base image
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat postgresql-client openssl && \
    ln -s /usr/lib/libssl.so.1.1 /usr/lib/libssl.so.1 && \
    ln -s /usr/lib/libcrypto.so.1.1 /usr/lib/libcrypto.so.1

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Copy package manager lockfiles and package.json
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on the lockfile
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install --frozen-lockfile; \
    else echo "No lockfile found" && exit 1; \
    fi

# Build stage: Compile the Next.js app
FROM base AS builder
WORKDIR /app

# Copy dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production stage: Create the final production image
FROM base AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership to non-root user
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose the default Next.js port
EXPOSE 3000

# Set the runtime port
ENV PORT 3000

# Add PostgreSQL-related environment variables (update these values as needed)
ENV DATABASE_URL="postgresql://postgres:admin@host.docker.internal:5433/creatiLab"

# Start the application
CMD ["node", "server.js"]
