import AppiumLauncher from './launcher.js';
export default class AppiumService {
}
export declare const launcher: typeof AppiumLauncher;
export * from './types.js';
import type { AppiumServiceConfig } from './types.js';
declare global {
    namespace WebdriverIO {
        interface ServiceOption extends AppiumServiceConfig {
        }
    }
}
//# sourceMappingURL=index.d.ts.map