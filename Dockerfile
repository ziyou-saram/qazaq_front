# FROM node:20-alpine AS deps
# WORKDIR /repo

# COPY package.json package-lock.json turbo.json ./
# COPY apps ./apps
# # COPY packages ./packages  <-- Commented out because directory is empty

# RUN npm ci

# FROM node:20-alpine AS build
# WORKDIR /repo
# COPY --from=deps /repo /repo

# ARG APP
# ARG NEXT_PUBLIC_API_URL
# # Convert APP arg to env var for turbo if needed, though arguments are passed to run command
# ENV APP=${APP}
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# # Build specific workspace
# RUN npm run build --workspace=apps/${APP}

# FROM node:20-alpine AS runner
# WORKDIR /repo
# ENV NODE_ENV=production

# COPY --from=build /repo /repo

# ARG APP
# ENV APP=${APP}

# EXPOSE 3000

# # Start command adjusted for correct variable expansion and path
# CMD ["sh", "-lc", "npm run start --workspace=apps/$APP -- --port 3000 --hostname 0.0.0.0"]

FROM node:20-alpine AS deps
WORKDIR /repo

# 1) Копируем только файлы, которые влияют на зависимости (для кеша)
COPY package.json package-lock.json turbo.json ./

# 2) Важно: для npm workspaces нужны package.json каждого workspace
COPY apps/public/package.json apps/public/package.json
COPY apps/cms/package.json apps/cms/package.json
# Если есть packages/*, аналогично:
# COPY packages/some/package.json packages/some/package.json

RUN npm ci


FROM node:20-alpine AS build
WORKDIR /repo

COPY --from=deps /repo /repo

# 3) Теперь копируем исходники (это будет ломать кеш только build-слой, а не deps)
COPY apps ./apps
# COPY packages ./packages

ARG APP
ARG NEXT_PUBLIC_API_URL
ENV APP=${APP}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Чуть меньше “шума” и иногда быстрее
ENV NEXT_TELEMETRY_DISABLED=1

# Если билд съедает всё — режем параллелизм турбо
ENV TURBO_CONCURRENCY=1

RUN npm run build --workspace=apps/${APP}


FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /repo /repo

ARG APP
ENV APP=${APP}

EXPOSE 3000
CMD ["sh", "-lc", "npm run start --workspace=apps/$APP -- --port 3000 --hostname 0.0.0.0"]