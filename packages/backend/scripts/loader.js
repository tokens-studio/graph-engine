import * as tsConfigPaths from "tsconfig-paths";
import { pathToFileURL } from "url";
import { resolve as resolveTs } from "ts-node/esm";

/**
 * Why do we do this?
 *
 * ESM path aliasing is shit https://github.com/TypeStrong/ts-node/issues/2068
 *
 * This allows us to use path aliasing with esm in a module, also without having to care about path extensions like .js / .ts which are a pain during compilation
 *
 *
 * There is a small performance hit, and it impacts hot reloading, but most hot reloaders work by emitting type decorator information ,etc which we rely upon anyway
 */

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();

const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

export function resolve(specifier, ctx, defaultResolve) {
  const match = matchPath(specifier);

  return match
    ? resolveTs(pathToFileURL(`${match}`).href, ctx, defaultResolve)
    : resolveTs(specifier, ctx, defaultResolve);
}

export { load, transformSource } from "ts-node/esm";
