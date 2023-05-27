"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootDir = exports.showConfig = exports.updateBuildInfo = exports.APPIUM_VER = exports.getGitRev = exports.getNonDefaultServerArgs = exports.validateTmpDir = exports.warnNodeDeprecations = exports.showBuildInfo = exports.checkNodeOk = exports.getBuildInfo = exports.checkNpmOk = void 0;
/* eslint-disable no-console */
const lodash_1 = __importDefault(require("lodash"));
const support_1 = require("@appium/support");
const axios_1 = __importDefault(require("axios"));
const teen_process_1 = require("teen_process");
const semver_1 = __importDefault(require("semver"));
const find_up_1 = __importDefault(require("find-up"));
const schema_1 = require("./schema/schema");
const npmPackage = support_1.fs.readPackageJsonFrom(__dirname);
const APPIUM_VER = npmPackage.version;
exports.APPIUM_VER = APPIUM_VER;
const ENGINES = /** @type {Record<string,string>} */ (npmPackage.engines);
const MIN_NODE_VERSION = ENGINES.node;
const MIN_NPM_VERSION = ENGINES.npm;
const GIT_META_ROOT = '.git';
const GIT_BINARY = `git${support_1.system.isWindows() ? '.exe' : ''}`;
const GITHUB_API = 'https://api.github.com/repos/appium/appium';
/**
 * @type {import('appium/types').BuildInfo}
 */
const BUILD_INFO = {
    version: APPIUM_VER,
};
function getNodeVersion() {
    return /** @type {import('semver').SemVer} */ (semver_1.default.coerce(process.version));
}
/**
 * Returns version of `npm`
 * @returns {Promise<string>}
 */
async function getNpmVersion() {
    const { stdout } = await (0, teen_process_1.exec)(support_1.system.isWindows() ? 'npm.cmd' : 'npm', ['--version']);
    return stdout.trim();
}
/**
 * @param {boolean} [useGithubApiFallback]
 */
async function updateBuildInfo(useGithubApiFallback = false) {
    const sha = await getGitRev(useGithubApiFallback);
    if (!sha) {
        return;
    }
    BUILD_INFO['git-sha'] = sha;
    const buildTimestamp = await getGitTimestamp(sha, useGithubApiFallback);
    if (buildTimestamp) {
        BUILD_INFO.built = buildTimestamp;
    }
}
exports.updateBuildInfo = updateBuildInfo;
/**
 * Finds the Git metadata dir (see `GIT_META_ROOT`)
 *
 * This is needed because Appium cannot assume `package.json` and `.git` are in the same
 * directory.  Monorepos, see?
 * @returns {Promise<string|undefined>} Path to dir or `undefined` if not found
 */
async function findGitRoot() {
    return await (0, find_up_1.default)(GIT_META_ROOT, { cwd: rootDir, type: 'directory' });
}
/**
 * @param {boolean} [useGithubApiFallback]
 * @returns {Promise<string?>}
 */
async function getGitRev(useGithubApiFallback = false) {
    const gitRoot = await findGitRoot();
    if (gitRoot) {
        try {
            const { stdout } = await (0, teen_process_1.exec)(GIT_BINARY, ['rev-parse', 'HEAD'], {
                cwd: gitRoot,
            });
            return stdout.trim();
        }
        catch (ign) { }
    }
    if (!useGithubApiFallback) {
        return null;
    }
    // If the package folder is not a valid git repository
    // then fetch the corresponding tag info from GitHub
    try {
        return (await axios_1.default.get(`${GITHUB_API}/git/refs/tags/appium@${APPIUM_VER}`, {
            headers: {
                'User-Agent': `Appium ${APPIUM_VER}`,
            },
        })).data?.object?.sha;
    }
    catch (ign) { }
    return null;
}
exports.getGitRev = getGitRev;
/**
 * @param {string} commitSha
 * @param {boolean} [useGithubApiFallback]
 * @returns {Promise<string?>}
 */
async function getGitTimestamp(commitSha, useGithubApiFallback = false) {
    const gitRoot = await findGitRoot();
    if (gitRoot) {
        try {
            const { stdout } = await (0, teen_process_1.exec)(GIT_BINARY, ['show', '-s', '--format=%ci', commitSha], {
                cwd: gitRoot,
            });
            return stdout.trim();
        }
        catch (ign) { }
    }
    if (!useGithubApiFallback) {
        return null;
    }
    try {
        return (await axios_1.default.get(`${GITHUB_API}/git/tags/${commitSha}`, {
            headers: {
                'User-Agent': `Appium ${APPIUM_VER}`,
            },
        })).data?.tagger?.date;
    }
    catch (ign) { }
    return null;
}
/**
 * Mutable object containing Appium build information. By default it
 * only contains the Appium version, but is updated with the build timestamp
 * and git commit hash asynchronously as soon as `updateBuildInfo` is called
 * and succeeds.
 * @returns {import('appium/types').BuildInfo}
 */
function getBuildInfo() {
    return BUILD_INFO;
}
exports.getBuildInfo = getBuildInfo;
function checkNodeOk() {
    const version = getNodeVersion();
    if (!semver_1.default.satisfies(version, MIN_NODE_VERSION)) {
        throw new Error(`Node version must be at least ${MIN_NODE_VERSION}; current is ${version.version}`);
    }
}
exports.checkNodeOk = checkNodeOk;
async function checkNpmOk() {
    const npmVersion = await getNpmVersion();
    if (!semver_1.default.satisfies(npmVersion, MIN_NPM_VERSION)) {
        throw new Error(`npm version must be at least ${MIN_NPM_VERSION}; current is ${npmVersion}. Run "npm install -g npm" to upgrade.`);
    }
}
exports.checkNpmOk = checkNpmOk;
function warnNodeDeprecations() {
    /**
     * Uncomment this section to get node version deprecation warnings
     * Also add test cases to config-specs.js to cover the cases added
     **/
    // const version = getNodeVersion();
    // if (version.major < 8) {
    //   logger.warn(`Appium support for versions of node < ${version.major} has been ` +
    //               'deprecated and will be removed in a future version. Please ' +
    //               'upgrade!');
    // }
}
exports.warnNodeDeprecations = warnNodeDeprecations;
async function showBuildInfo() {
    await updateBuildInfo(true);
    console.log(JSON.stringify(getBuildInfo())); // eslint-disable-line no-console
}
exports.showBuildInfo = showBuildInfo;
/**
 * Returns k/v pairs of server arguments which are _not_ the defaults.
 * @param {Args} parsedArgs
 * @returns {Args}
 */
function getNonDefaultServerArgs(parsedArgs) {
    /**
     * Flattens parsed args into a single level object for comparison with
     * flattened defaults across server args and extension args.
     * @param {Args} args
     * @returns {Record<string, { value: any, argSpec: ArgSpec }>}
     */
    const flatten = (args) => {
        const argSpecs = (0, schema_1.getAllArgSpecs)();
        const flattened = lodash_1.default.reduce([...argSpecs.values()], (acc, argSpec) => {
            if (lodash_1.default.has(args, argSpec.dest)) {
                acc[argSpec.dest] = { value: lodash_1.default.get(args, argSpec.dest), argSpec };
            }
            return acc;
        }, 
        /** @type {Record<string, { value: any, argSpec: ArgSpec }>} */ ({}));
        return flattened;
    };
    const args = flatten(parsedArgs);
    // hopefully these function names are descriptive enough
    const typesDiffer = /** @param {string} dest */ (dest) => typeof args[dest].value !== typeof defaultsFromSchema[dest];
    const defaultValueIsArray = /** @param {string} dest */ (dest) => lodash_1.default.isArray(defaultsFromSchema[dest]);
    const argsValueIsArray = /** @param {string} dest */ (dest) => lodash_1.default.isArray(args[dest].value);
    const arraysDiffer = /** @param {string} dest */ (dest) => lodash_1.default.gt(lodash_1.default.size(lodash_1.default.difference(args[dest].value, defaultsFromSchema[dest])), 0);
    const valuesDiffer = /** @param {string} dest */ (dest) => args[dest].value !== defaultsFromSchema[dest];
    const defaultIsDefined = /** @param {string} dest */ (dest) => !lodash_1.default.isUndefined(defaultsFromSchema[dest]);
    // note that `_.overEvery` is like an "AND", and `_.overSome` is like an "OR"
    const argValueNotArrayOrArraysDiffer = lodash_1.default.overSome([lodash_1.default.negate(argsValueIsArray), arraysDiffer]);
    const defaultValueNotArrayAndValuesDiffer = lodash_1.default.overEvery([
        lodash_1.default.negate(defaultValueIsArray),
        valuesDiffer,
    ]);
    /**
     * This used to be a hideous conditional, but it's broken up into a hideous function instead.
     * hopefully this makes things a little more understandable.
     * - checks if the default value is defined
     * - if so, and the default is not an array:
     *   - ensures the types are the same
     *   - ensures the values are equal
     * - if so, and the default is an array:
     *   - ensures the args value is an array
     *   - ensures the args values do not differ from the default values
     * @type {(dest: string) => boolean}
     */
    const isNotDefault = lodash_1.default.overEvery([
        defaultIsDefined,
        lodash_1.default.overSome([
            typesDiffer,
            lodash_1.default.overEvery([defaultValueIsArray, argValueNotArrayOrArraysDiffer]),
            defaultValueNotArrayAndValuesDiffer,
        ]),
    ]);
    const defaultsFromSchema = (0, schema_1.getDefaultsForSchema)(true);
    return lodash_1.default.reduce(lodash_1.default.pickBy(args, (__, key) => isNotDefault(key)), 
    // explodes the flattened object back into nested one
    (acc, { value, argSpec }) => lodash_1.default.set(acc, argSpec.dest, value), 
    /** @type {Args} */ ({}));
}
exports.getNonDefaultServerArgs = getNonDefaultServerArgs;
/**
 * Compacts an object for {@link showConfig}:
 * 1. Removes `subcommand` key/value
 * 2. Removes `undefined` values
 * 3. Removes empty objects (but not `false` values)
 * Does not operate recursively.
 */
const compactConfig = lodash_1.default.partial(lodash_1.default.omitBy, lodash_1.default, (value, key) => key === 'subcommand' || lodash_1.default.isUndefined(value) || (lodash_1.default.isObject(value) && lodash_1.default.isEmpty(value)));
/**
 * Shows a breakdown of the current config after CLI params, config file loaded & defaults applied.
 *
 * The actual shape of `preConfigParsedArgs` and `defaults` does not matter for the purposes of this function,
 * but it's intended to be called with values of type {@link ParsedArgs} and `DefaultValues<true>`, respectively.
 *
 * @param {Partial<ParsedArgs>} nonDefaultPreConfigParsedArgs - Parsed CLI args (or param to `init()`) before config & defaults applied
 * @param {import('./config-file').ReadConfigFileResult} configResult - Result of attempting to load a config file.  _Must_ be normalized
 * @param {Partial<ParsedArgs>} defaults - Configuration defaults from schemas
 * @param {ParsedArgs} parsedArgs - Entire parsed args object
 */
function showConfig(nonDefaultPreConfigParsedArgs, configResult, defaults, parsedArgs) {
    console.log('Appium Configuration\n');
    console.log('from defaults:\n');
    console.dir(compactConfig(defaults));
    if (configResult.config) {
        console.log(`\nfrom config file at ${configResult.filepath}:\n`);
        console.dir(compactConfig(configResult.config));
    }
    else {
        console.log(`\n(no configuration file loaded)`);
    }
    const compactedNonDefaultPreConfigArgs = compactConfig(nonDefaultPreConfigParsedArgs);
    if (lodash_1.default.isEmpty(compactedNonDefaultPreConfigArgs)) {
        console.log(`\n(no CLI parameters provided)`);
    }
    else {
        console.log('\nvia CLI or function call:\n');
        console.dir(compactedNonDefaultPreConfigArgs);
    }
    console.log('\nfinal configuration:\n');
    console.dir(compactConfig(parsedArgs));
}
exports.showConfig = showConfig;
/**
 * @param {string} tmpDir
 */
async function validateTmpDir(tmpDir) {
    try {
        await support_1.fs.mkdirp(tmpDir);
    }
    catch (e) {
        throw new Error(`We could not ensure that the temp dir you specified ` +
            `(${tmpDir}) exists. Please make sure it's writeable.`);
    }
}
exports.validateTmpDir = validateTmpDir;
const rootDir = support_1.fs.findRoot(__dirname);
exports.rootDir = rootDir;
/**
 * @typedef {import('appium/types').ParsedArgs} ParsedArgs
 * @typedef {import('appium/types').Args} Args
 * @typedef {import('./schema/arg-spec').ArgSpec} ArgSpec
 */
//# sourceMappingURL=config.js.map