# Graph-engine-docs

This is the source code for the documentation of the open source tool [Generators and Resolvers by Tokens Studio](https://resolver.dev.tokens.studio/)

## Quickstart

1. `yarn  --frozen-lockfile`
2. `yarn run dev`  

## Dependendencies

Dev dependencies should only be used for developmental processes like linting, etc while prod dependencies should be all thats required to build the site.

## LFS

This repo is using git LFS to track large binary files like images and videos. Please see the installation instructions [here](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage)

## Notes

This site is intended to be used as a static site with cloudfront and S3, as such a number of Next properties and behaviours, notably i8n have been turned off to support this.
