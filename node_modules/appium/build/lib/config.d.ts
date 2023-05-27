export function checkNpmOk(): Promise<void>;
export type ParsedArgs = import('appium/types').ParsedArgs;
export type Args = import('appium/types').Args;
export type ArgSpec = import("./schema/arg-spec").ArgSpec<any>;
/**
 * Mutable object containing Appium build information. By default it
 * only contains the Appium version, but is updated with the build timestamp
 * and git commit hash asynchronously as soon as `updateBuildInfo` is called
 * and succeeds.
 * @returns {import('appium/types').BuildInfo}
 */
export function getBuildInfo(): import('appium/types').BuildInfo;
export function checkNodeOk(): void;
export function showBuildInfo(): Promise<void>;
export function warnNodeDeprecations(): void;
/**
 * @param {string} tmpDir
 */
export function validateTmpDir(tmpDir: string): Promise<void>;
/**
 * Returns k/v pairs of server arguments which are _not_ the defaults.
 * @param {Args} parsedArgs
 * @returns {Args}
 */
export function getNonDefaultServerArgs(parsedArgs: Args): Args;
/**
 * @param {boolean} [useGithubApiFallback]
 * @returns {Promise<string?>}
 */
export function getGitRev(useGithubApiFallback?: boolean | undefined): Promise<string | null>;
export const APPIUM_VER: string;
/**
 * @param {boolean} [useGithubApiFallback]
 */
export function updateBuildInfo(useGithubApiFallback?: boolean | undefined): Promise<void>;
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
export function showConfig(nonDefaultPreConfigParsedArgs: Partial<ParsedArgs>, configResult: import('./config-file').ReadConfigFileResult, defaults: Partial<ParsedArgs>, parsedArgs: ParsedArgs): void;
export const rootDir: string;
//# sourceMappingURL=config.d.ts.map