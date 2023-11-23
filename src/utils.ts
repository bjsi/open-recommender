import { argv } from "process";
import { fileURLToPath } from "url";

/**
 * Check if a module is the main module launched with the node process.
 * Meaning the module is NOT imported by another module,
 * but was directly invoked by `node`, like this: `$ node main.js`
 *
 * @example
 * ```js
 * // main.js
 * import lib from "./lib.js"
 * import { isMain } from "./utils.js"
 *
 * if (isMain(import.meta.url)) {
 *   console.log("I print to stdout")
 * }
 *
 * // lib.js
 * import { isMain } from "./utils"
 *
 * if (isMain(import.meta.url)) {
 *   console.log("I don't run, because I'm an imported module")
 * }
 * ```
 *
 * @param {string} moduleUrl needs to be `import.meta.url`
 * @returns {boolean} true if the module is the main module
 */
export function isMain(moduleUrl: string) {
  const modulePath = fileURLToPath(moduleUrl);
  const [_binPath, mainScriptPath] = argv;
  return modulePath === mainScriptPath;
}
