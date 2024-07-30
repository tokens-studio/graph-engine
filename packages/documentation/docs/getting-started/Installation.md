---
title: Installation
sidebar_position: 0
---

There are two ways to get started with the graph engine, either through the UI or programmatically.

The UI is the easiest way for newcomers.

## Docker

1. Make sure you have docker installed. Please follow the [guide](https://docs.docker.com/get-docker/) if you do not. Ensure you can run it by issuing the following on your command line

```sh
docker-compose -v 
```

You should get something like the following 

```sh
Docker Compose version v2.26.1-desktop.1
```

2. Create a Github App

You will need to create a [github app](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps) first to handle auth. You will likely need to use `http://localhost:3000/api/auth/callback/github` as your callback url.

Make sure to allow email as a required permission.

Copy the IDs and secret for the next step


3. Copy the contents of the following into a file called `docker-compose.yml`

```yaml
version: '3.7'
services:
  graph:
    hostname: graph
    depends_on:
      - postgresql
    image: graph-engine2-web:latest
    # image: tokensstudio/graph-engine-frontend:latest
    environment:
      HOSTNAME: 0.0.0.0
      AUTH_URL: http://localhost:3000/api/auth
      AUTH_SECRET: mMDrwG7Cg54aZoDnJz6dZRgRxrt3KG9gDh+UMv2U7ds=
      AUTH_GITHUB_ID: <CHANGE_ME>
      AUTH_GITHUB_SECRET: <CHANGE_ME>
      DATABASE_URL: postgres://${POSTGRES_USER:-user}:${POSTGRES_PASSWORD:-password}@postgresql:5432/${POSTGRES_DB:-db}
    ports:
      - "3000:3000"

  postgresql:
    image: postgres:13
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
      POSTGRES_DB: ${POSTGRES_DB:-db}
    ports:
      - "5432:5432"

```

Note that you will need to change the values marked `<CHANGE_ME>` to the values you obtained in the previous step.

4. Start it 

```sh
docker-compose up
```

You should be able to then go to `http://localhost:3000` to access the app

## Locally

Clone the project

```bash
git clone git@github.com:tokens-studio/graph-engine.git
cd graph-engine
yarn
# Start the docker
docker-compose up &
yarn run dev:ui:live
```
