import fs from "fs";
import nodePath from "path";

export type Options = {
  autoResolve?: boolean;
};

//Note this has to be hardcoded otherwise it breaks some bundlers and compilers
const filePath = new URL(
  "@imagemagick/magick-wasm/magick.wasm",
  import.meta.url,
).href;
const _scriptDir = import.meta.url;
const ENVIRONMENT_IS_WEB = typeof window == "object";
// eslint-disable-next-line no-undef
declare const importScripts: (...urls: string[]) => void;

const ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
const ENVIRONMENT_IS_NODE =
  typeof process == "object" &&
  typeof process.versions == "object" &&
  typeof process.versions.node == "string";

let scriptDirectory = "";

const isFileURI = (filename) => filename.startsWith("file://");

let read_ = (filename, binary) => {
    // We need to re-wrap `file://` strings to URLs. Normalizing isn't
    // necessary in that case, the path should already be absolute.
    filename = isFileURI(filename)
      ? new URL(filename)
      : nodePath.normalize(filename);
    return fs.readFileSync(filename, binary ? undefined : "utf8");
  },
  readAsync,
  readBinary;

async function setup() {
  if (ENVIRONMENT_IS_NODE) {
    if (
      typeof process == "undefined" ||
      !process.release ||
      process.release.name !== "node"
    )
      throw new Error(
        "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)",
      );

    const nodeVersion = process.versions.node;
    const numericVersionArr = nodeVersion.split(".").slice(0, 3);
    const numericVersion: number = (~~numericVersionArr[0] as number) * 10000;
    if (numericVersion < 160000) {
      throw new Error(
        "This emscripten-generated code requires node v16.0.0 (detected v" +
          nodeVersion +
          ")",
      );
    }

    // `require()` is no-op in an ESM module, use `createRequire()` to construct
    // the require()` function.  This is only necessary for multi-environment
    // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
    // TODO: Swap all `require()`'s with `import()`'s?

    //@ts-expect-error This should exist when importing the module like this
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);

    // These modules will usually be used on Node.js. Load them eagerly to avoid
    // the complexity of lazy-loading.
    const fs = require("fs");
    const nodePath = require("path");

    if (ENVIRONMENT_IS_WORKER) {
      scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
    }

    // include: node_shell_read.js
    read_ = (filename: string, binary: boolean) => {
      // We need to re-wrap `file://` strings to URLs. Normalizing isn't
      // necessary in that case, the path should already be absolute.
      filename = isFileURI(filename)
        ? new URL(filename)
        : nodePath.normalize(filename);
      return fs.readFileSync(filename, binary ? undefined : "utf8");
    };

    readBinary = (filename: string, opts: Options) => {
      if (opts.autoResolve) {
        filename = require.resolve(filename);
      }

      const ret = read_(filename, true);
      //@ts-expect-error. This is due to the fact that this could be a string or buffer, but this is type safe
      if (!ret.buffer) {
        return new Uint8Array(ret as unknown as ArrayBuffer);
      }
      return ret;
    };

    readAsync = (filename, onload, onerror, binary = true) => {
      // See the comment in the `read_` function.
      filename = isFileURI(filename)
        ? new URL(filename)
        : nodePath.normalize(filename);
      fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
        if (err) onerror(err);
        else onload(binary ? data.buffer : data);
      });
    };
  } else {
    // Note that this includes Node.js workers when relevant (pthreads is enabled).
    // Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
    // ENVIRONMENT_IS_NODE.
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        // Check worker, not web, since window could be polyfilled
        scriptDirectory = self.location.href;
      } else if (typeof document != "undefined" && document.currentScript) {
        // web
        //@ts-expect-error This is correct
        scriptDirectory = document.currentScript.src;
      }
      // When MODULARIZE, this JS may be executed later, after document.currentScript
      // is gone, so we saved it, and we use it here instead of any other info.
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
      // otherwise, slice off the final part of the url to find the script directory.
      // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
      // and scriptDirectory will correctly be replaced with an empty string.
      // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
      // they are removed because they could contain a slash.
      if (scriptDirectory.startsWith("blob:")) {
        scriptDirectory = "";
      } else {
        scriptDirectory = scriptDirectory.substr(
          0,
          scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1,
        );
      }

      if (!(typeof window == "object" || typeof importScripts == "function"))
        throw new Error(
          "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)",
        );

      // Differentiate the Web Worker from the Node Worker case, as reading must
      // be done differently.
      {
        // include: web_or_worker_shell_read.js
        read_ = (url) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };

        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(/** @type{!ArrayBuffer} */ xhr.response);
          };
        }

        readAsync = (url, onload, onerror) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              // file URLs can return 0
              onload(xhr.response);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };

        // end include: web_or_worker_shell_read.js
      }
    } else {
      throw new Error("environment detection error");
    }
  }
}

function getBinarySync(file, opts: Options) {
  if (readBinary) {
    return readBinary(file, opts);
  }
  throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(opts: Options) {
  // If we don't have the binary yet, try to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    const binaryFile = filePath;
    if (typeof fetch == "function" && !isFileURI(binaryFile)) {
      return fetch(binaryFile, { credentials: "same-origin" })
        .then((response) => {
          if (!response["ok"]) {
            throw `failed to load wasm binary file at '${binaryFile}'`;
          }
          return response["arrayBuffer"]();
        })
        .catch(() => getBinarySync(binaryFile, opts));
    } else if (readAsync) {
      // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
      return new Promise((resolve, reject) => {
        readAsync(
          binaryFile,
          (response) =>
            resolve(new Uint8Array(/** @type{!ArrayBuffer} */ response)),
          reject,
        );
      });
    }
  }

  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(filePath, opts));
}

/**
 * @returns
 */
export async function load(wasmPath: string, opts: Options) {
  await setup();
  return await getBinaryPromise(opts);
}
