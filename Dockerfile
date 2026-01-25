FROM node:20-alpine AS deps
WORKDIR /repo

COPY package.json package-lock.json turbo.json ./
COPY apps ./apps
# COPY packages ./packages  <-- Commented out because directory is empty

RUN npm ci

FROM node:20-alpine AS build
WORKDIR /repo
COPY --from=deps /repo /repo

ARG APP
ARG NEXT_PUBLIC_API_URL
# Convert APP arg to env var for turbo if needed, though arguments are passed to run command
ENV APP=${APP}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build specific workspace
RUN npm run build --workspace=apps/${APP}

FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production

COPY --from=build /repo /repo

ARG APP
ENV APP=${APP}

EXPOSE 3000

# Start command adjusted for correct variable expansion and path
CMD ["sh", "-lc", "npm run start --workspace=apps/$APP -- --port 3000 --hostname 0.0.0.0"]
