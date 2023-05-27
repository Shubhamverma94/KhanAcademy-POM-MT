import type { Capabilities, Options } from '@wdio/types';
import type { ModuleImportService } from './types.js';
export declare const validObjectOrArray: (object: any) => object is object | any[];
/**
 * remove line numbers from file path, ex:
 * `/foo:9` or `c:\bar:14:5`
 * @param   {string} filePath path to spec file
 * @returns {string}
 */
export declare function removeLineNumbers(filePath: string): string;
/**
 * does spec file path contain Cucumber's line number, ex
 * `/foo/bar:9` or `c:\bar\foo:14:5`
 * @param {string|string[]} spec
 */
export declare function isCucumberFeatureWithLineNumber(spec: string | string[]): boolean;
export declare function isCloudCapability(caps: Capabilities.Capabilities): boolean;
/**
 * validates configurations based on default values
 * @param  {Object} defaults  object describing all allowed properties
 * @param  {Object} options   option to check against
 * @return {Object}           validated config enriched with default values
 */
export declare function validateConfig<T>(defaults: Options.Definition<T>, options: T, keysToKeep?: (keyof T)[]): T;
export declare function loadAutoCompilers(autoCompileConfig: Options.AutoCompileConfig, requireService: ModuleImportService): Promise<boolean | undefined>;
export declare function loadTypeScriptCompiler(autoCompileConfig: Options.AutoCompileConfig): Promise<boolean>;
export declare function objectToEnv(params?: Record<string, any>): void;
export declare function loadBabelCompiler(babelOpts: Record<string, any> | undefined, requireService: ModuleImportService): Promise<boolean>;
export declare function makeRelativeToCWD(files?: (string | string[])[]): (string | string[])[];
//# sourceMappingURL=utils.d.ts.map