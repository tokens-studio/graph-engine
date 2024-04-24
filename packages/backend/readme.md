# Backend


This is the backend for the Tokens Studio Graph project


### Gotchas

Do not import from the tsoa package directly. It's written in commonjs but expects to export esm compatible code, rather import from the `@tsoa/runtime` module directly
