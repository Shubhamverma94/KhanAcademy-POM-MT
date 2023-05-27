"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveDrivers = exports.getActivePlugins = exports.loadExtensions = void 0;
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
const driver_config_1 = require("./driver-config");
const manifest_1 = require("./manifest");
const plugin_config_1 = require("./plugin-config");
const bluebird_1 = __importDefault(require("bluebird"));
/**
 * Loads extensions and creates `ExtensionConfig` instances.
 *
 * - Reads the manifest file, creating if necessary
 * - Using the parsed extension data, creates/gets the `ExtensionConfig` subclass instances
 * - Returns these instances
 *
 * If `appiumHome` is needed, use `resolveAppiumHome` from the `env` module in `@appium/support`.
 * @param {string} appiumHome
 * @returns {Promise<ExtensionConfigs>}
 */
async function loadExtensions(appiumHome) {
    const manifest = manifest_1.Manifest.getInstance(appiumHome);
    await manifest.read();
    const driverConfig = driver_config_1.DriverConfig.getInstance(manifest) ?? driver_config_1.DriverConfig.create(manifest);
    const pluginConfig = plugin_config_1.PluginConfig.getInstance(manifest) ?? plugin_config_1.PluginConfig.create(manifest);
    await bluebird_1.default.all([driverConfig.validate(), pluginConfig.validate()]);
    return { driverConfig, pluginConfig };
}
exports.loadExtensions = loadExtensions;
/**
 * Find any plugin name which has been installed, and which has been requested for activation by
 * using the --use-plugins flag, and turn each one into its class, so we can send them as objects
 * to the server init. We also want to send/assign them to the umbrella driver so it can use them
 * to wrap command execution
 *
 * @param {import('./plugin-config').PluginConfig} pluginConfig - a plugin extension config
 * @param {string[]} usePlugins
 * @returns {PluginNameMap} Mapping of PluginClass to name
 */
function getActivePlugins(pluginConfig, usePlugins = []) {
    return new Map(lodash_1.default.compact(Object.keys(pluginConfig.installedExtensions)
        .filter((pluginName) => lodash_1.default.includes(usePlugins, pluginName) ||
        (usePlugins.length === 1 && usePlugins[0] === constants_1.USE_ALL_PLUGINS))
        .map((pluginName) => {
        try {
            logger_1.default.info(`Attempting to load plugin ${pluginName}...`);
            const PluginClass = pluginConfig.require(pluginName);
            return [PluginClass, pluginName];
        }
        catch (err) {
            logger_1.default.error(`Could not load plugin '${pluginName}', so it will not be available. Error ` +
                `in loading the plugin was: ${err.message}`);
            logger_1.default.debug(err.stack);
        }
    })));
}
exports.getActivePlugins = getActivePlugins;
/**
 * Find any driver name which has been installed, and turn each one into its class, so we can send
 * them as objects to the server init in case they need to add methods/routes or update the server.
 * If the --drivers flag was given, this method only loads the given drivers.
 *
 * @param {import('./driver-config').DriverConfig} driverConfig - a driver extension config
 * @param {string[]} [useDrivers] - optional list of drivers to load
 * @returns {DriverNameMap}
 */
function getActiveDrivers(driverConfig, useDrivers = []) {
    return new Map(lodash_1.default.compact(Object.keys(driverConfig.installedExtensions)
        .filter((driverName) => lodash_1.default.includes(useDrivers, driverName) || useDrivers.length === 0)
        .map((driverName) => {
        try {
            logger_1.default.info(`Attempting to load driver ${driverName}...`);
            const DriverClass = driverConfig.require(driverName);
            return [DriverClass, driverName];
        }
        catch (err) {
            logger_1.default.error(`Could not load driver '${driverName}', so it will not be available. Error ` +
                `in loading the driver was: ${err.message}`);
            logger_1.default.debug(err.stack);
        }
    })));
}
exports.getActiveDrivers = getActiveDrivers;
/**
 * A mapping of {@linkcode PluginClass} classes to their names.
 * @typedef {Map<PluginClass,string>} PluginNameMap
 */
/**
 * A mapping of {@linkcode DriverClass} classes to their names.
 * @typedef {Map<DriverClass,string>} DriverNameMap
 */
/**
 * @typedef {import('@appium/types').PluginClass} PluginClass
 * @typedef {import('@appium/types').DriverClass} DriverClass
 */
/**
 * @typedef ExtensionConfigs
 * @property {import('./driver-config').DriverConfig} driverConfig
 * @property {import('./plugin-config').PluginConfig} pluginConfig
 */
//# sourceMappingURL=index.js.map