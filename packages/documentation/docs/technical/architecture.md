# Architecture

The entirety of the Graph Engine is written in [typescript](https://www.typescriptlang.org/).

We use the following services to help with the system 

- [Ory Kratos](https://github.com/ory/kratos)

This helps us manage users to system and support for security mechanisms like multifactor authentication, Social logins, custom identities,etc 

- [Ory Oathkeeper](https://github.com/ory/oathkeeper)

An Idenity & Access Proxy. Oathkeeper is used in conjunction with Kratos to handle sessions and support zero trust networks.  It authenticates requests and simplifies the actual API backend to focus on its core logic

- [Ory Keto](https://github.com/ory/keto)

A modern permission system that can scale with complex ACL based on [Google's Zanzibar system](https://research.google/pubs/pub48190/)

![Architecture](./imgs/architecture.svg)