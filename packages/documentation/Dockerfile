FROM node:20-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo telemetry disable
RUN turbo prune --scope @tokens-studio/graph-engine-documentation --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN yarn global add turbo

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/patches ./patches 
COPY --from=builder /app/out/yarn.lock ./yarn.lock
# Build the project

COPY ../turbo.json turbo.json
RUN yarn install
RUN yarn run postinstall

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
RUN yarn run build:docs 

FROM base AS runner

WORKDIR /app
RUN adduser -D nextuser 
RUN yarn global add serve@14.2.3
# set non root user
USER nextuser

COPY --from=installer --chown=nextuser:nextuser  /app/packages/documentation/build/ .

EXPOSE 3000
ENTRYPOINT ["serve"]
