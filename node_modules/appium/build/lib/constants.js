"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LONG_STACKTRACE_LIMIT = exports.CURRENT_SCHEMA_REV = exports.EXT_SUBCOMMAND_RUN = exports.EXT_SUBCOMMAND_UPDATE = exports.EXT_SUBCOMMAND_UNINSTALL = exports.EXT_SUBCOMMAND_INSTALL = exports.EXT_SUBCOMMAND_LIST = exports.PKG_HASHFILE_RELATIVE_PATH = exports.CACHE_DIR_RELATIVE_PATH = exports.KNOWN_DRIVERS = exports.KNOWN_PLUGINS = exports.USE_ALL_PLUGINS = exports.SERVER_SUBCOMMAND = exports.PLUGIN_TYPE = exports.DRIVER_TYPE = void 0;
const path_1 = __importDefault(require("path"));
/**
 * The name of the extension type for drivers
 */
exports.DRIVER_TYPE = 'driver';
/**
 * The name of the extension type for plugins
 */
exports.PLUGIN_TYPE = 'plugin';
/**
 * The `server` command of the `appium` CLI
 */
exports.SERVER_SUBCOMMAND = 'server';
/**
 * The value of `--use-plugins` if _all_ plugins should be loaded
 */
exports.USE_ALL_PLUGINS = 'all';
// This is a map of plugin names to npm packages representing those plugins.
// The plugins in this list will be available to the CLI so users can just
// type 'appium plugin install 'name'', rather than having to specify the full
// npm package. I.e., these are the officially recognized plugins.
exports.KNOWN_PLUGINS = Object.freeze(
/** @type {const} */ ({
    images: '@appium/images-plugin',
    'execute-driver': '@appium/execute-driver-plugin',
    'relaxed-caps': '@appium/relaxed-caps-plugin',
    'universal-xml': '@appium/universal-xml-plugin',
}));
// This is a map of driver names to npm packages representing those drivers.
// The drivers in this list will be available to the CLI so users can just
// type 'appium driver install 'name'', rather than having to specify the full
// npm package. I.e., these are the officially recognized drivers.
exports.KNOWN_DRIVERS = Object.freeze(
/** @type {const} */ ({
    uiautomator2: 'appium-uiautomator2-driver',
    xcuitest: 'appium-xcuitest-driver',
    mac2: 'appium-mac2-driver',
    espresso: 'appium-espresso-driver',
    safari: 'appium-safari-driver',
    gecko: 'appium-geckodriver',
    chromium: 'appium-chromium-driver',
}));
/**
 * Relative path to directory containing any Appium internal files
 */
exports.CACHE_DIR_RELATIVE_PATH = path_1.default.join('node_modules', '.cache', 'appium');
/**
 * Relative path to hashfile (from `APPIUM_HOME`) of consuming project's `package.json` (if it exists)
 */
exports.PKG_HASHFILE_RELATIVE_PATH = path_1.default.join(exports.CACHE_DIR_RELATIVE_PATH, 'package.hash');
exports.EXT_SUBCOMMAND_LIST = 'list';
exports.EXT_SUBCOMMAND_INSTALL = 'install';
exports.EXT_SUBCOMMAND_UNINSTALL = 'uninstall';
exports.EXT_SUBCOMMAND_UPDATE = 'update';
exports.EXT_SUBCOMMAND_RUN = 'run';
/**
 * Current revision of the manifest (`extensions.yaml`) schema
 */
exports.CURRENT_SCHEMA_REV = 4;
/**
 * The default number of stack frames to show in a "long" stack trace, when enabled via `--long-stacktrace`
 * @remarks This value may be increased in the future.
 * @privateRemarks A value like `Infinity` may provide to have deleterious effects on
 * memory usage, perf, and/or log output, and higher limits may be difficult to scan.
 */
exports.LONG_STACKTRACE_LIMIT = 100;
//# sourceMappingURL=constants.js.map