# UI

## Setup

1. Setup Auth

You will need to create a [github app](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps) first to handle auth. You will likely need to use `http://localhost:3000/api/auth/callback/github` as your callback url

Once this is completed, create a `.env.local` file and replace the values `AUTH_GITHUB_ID`,`AUTH_GITHUB_SECRET` values from your app

2. Setup the database

The app needs to persist values and thus needs a database.

You can run the docker-compose in the root of this project to setup the database. Otherwise you will need to setup your own database and override the values in the system.

You will need to run the migrations once using `npm run db:deploy`

3. Start the server

Run `npm run dev:ui:live` from the root of the project to get live updates
