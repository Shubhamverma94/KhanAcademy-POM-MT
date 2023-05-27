interface Retries {
    limit: number;
    attempts: number;
}
declare global {
    var expectAsync: any;
}
declare global {
    namespace NodeJS {
        interface Global {
            expect: any;
            expectAsync: any;
        }
    }
}
declare const executeHooksWithArgs: <T>(this: any, hookName: string, hooks?: Function | Function[], args?: any[]) => Promise<(Error | T)[]>;
/**
 * wrap command to enable before and after command to be executed
 * @param commandName name of the command (e.g. getTitle)
 * @param fn          command function
 */
declare const wrapCommand: <T>(commandName: string, fn: Function) => (...args: any) => Promise<T>;
/**
 * execute test or hook asynchronously
 *
 * @param  {Function} fn         spec or hook method
 * @param  {object}   retries    { limit: number, attempts: number }
 * @param  {Array}    args       arguments passed to hook
 * @return {Promise}             that gets resolved once test/hook is done or was retried enough
 */
declare function executeAsync(this: any, fn: Function, retries: Retries, args?: any[]): Promise<unknown>;
export { executeHooksWithArgs, wrapCommand, executeAsync, };
//# sourceMappingURL=shim.d.ts.map