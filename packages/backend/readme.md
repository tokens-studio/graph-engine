# Backend


This is the backend for the Tokens Studio Graph project

## Setup

You will need to run `npx prisma migrate dev` to initially setup the database and apply migrations


### Gotchas

Do not import from the tsoa package directly. It's written in commonjs but expects to export esm compatible code, rather import from the `@tsoa/runtime` module directly
