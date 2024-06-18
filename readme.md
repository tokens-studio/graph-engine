# Tokens Studio Graph Engine Monorepo

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/graph-engine) ![License badge](https://img.shields.io/github/license/tokens-studio/types)

This is the monorepo for the full Tokens Studio ecosystem powered by [Turborepo](https://turbo.build/)

See the Graph-Engine library [here](./packages/graph-engine/readme.md)

### Documentation 

See the hosted documentation [here](https://graph.docs.tokens.studio/)

## Development

### Quickstart

Run yarn to install dependencies

```sh
yarn
```

Run the appropriate dev script for you app or library.

### Docker

To setup a docker development environment you can use the provided `docker-compose.yaml` file via a `docker-compose up` command

Note that we do use images from ghcr.io which means you will need to authenticate there. Follow [this guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) to logging into ghcr.


Running `docker-compose up` will create the following services

- [kratos](https://www.ory.sh/kratos/) which handles identity management. In our scenario it is responsible for creating users, SSO, MFA ,etc
- [mailslurper](https://www.mailslurper.com/) A small SMTP server that acts as the courier for sending emails for kratos. We can use the UI to view sent emails to handle verification and magic email link logins
- [oathkeeper](https://github.com/ory/oathkeeper). An identity access proxy. It sits in front of our backend and verifies the identity of users when making server request
- [kratos-admin](https://github.com/dfoxg/kratos-admin-ui). A simple admin interface for kratos to see which users are being administrated
- [kratos-selfservice-ui-node](https://github.com/ory/kratos-selfservice-ui-node). A user portal for users to signup and login 


To access these services you will need to use the appropriate ports which should be opened on your localhost. **Note** that you should use a consistent way to reference your localhost. Do not mix and match `localhost` and `127.0.0.1`. We prefer `127.0.0.1`

You should be able to `http://127.0.0.1:7979/auth/`. This will go through oathkeeper and redirect you to a login. You can create a new account here. 

After you have created an account, go to `http://127.0.0.1:4436` This will allow you to click on the verification link that kratos sent out for your new account.

Once this is complete, kratos will create a session auth token on the domain you signed up on. In this case `127.0.0.1`.

You can now spin up the backend for live development by using `npm run dev:api` from the root directory. This will run a live reloading version of the API.

This api is proxied through oathkeeper as well. Oathkeeper will intercept the request, verify the identity with kratos and call the api backend with a jwt representing the identity of the user. 

The url for the backend would be `http://127.0.0.1:7979/api/` as the base path.

You can access a swaggerUI via `http://127.0.0.1:7979/api/swagger` for a visual representation of the api
 

### Graph Engine

The graph engine can be run independently of the UI through

```sh
yarn run dev:engine
```

### UI for the Engine

```sh
yarn run dev:ui
```

This builds the required deps and then runs the development server for studio. In the case that you might be changing the dependencies of Studio whilst using studio, you can use

```sh
yarn run dev:ui:live
```

which will run live dev for studio and its deps and update the dependencies

## Developer documentation

See additional developer documentation [here](./developer-documentation/index.md) for specifics on how the graph engine works

## API

See the developer API [here](https://tokens-studio.github.io/graph-engine/)

## Dependency graphs

You should be able to run the `dev:<APP_OR_LIB>:graph` script to generate a dependency graph pdf in the `./graphs` directory.

## Notes

We use [yarn](https://classic.yarnpkg.com/) as our package manager. Pnpm causes some issues with libraries that rely on being relative to their source without symlinks

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
