---
title: Installation
sidebar_position: 0
---

There are two ways to get started with the graph engine, either through the UI or programmatically.

The UI is the easiest way for newcomers.

## Docker

You can run just the UI by pulling the docker image

Run

```
docker run -p 3000:3000 tokensstudio/graph-engine-frontend:latest
```

The editor should now be available at `http://localhost:3000/dashboard/editor`

## Locally

Clone the project

```bash
git clone git@github.com:tokens-studio/graph-engine.git
cd graph-engine
yarn
yarn run dev:ui:live
```
