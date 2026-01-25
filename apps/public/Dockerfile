FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine for Alpine compatibility issues
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json turbo.json ./
COPY apps/public/package.json ./apps/public/package.json

# If you had shared packages, you would copy them here. 
# COPY packages ./packages

RUN npm i

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will build the public app
RUN npm run build --workspace=apps/public

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/public/public ./apps/public/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/public/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/public/.next/static ./apps/public/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/public/server.js"]
