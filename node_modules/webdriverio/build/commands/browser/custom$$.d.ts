import type { ElementArray } from '../../types.js';
/**
 *
 * The `customs$$` allows you to use a custom strategy declared by using `browser.addLocatorStrategy`
 *
 * <example>
    :example.js
    it('should get all the plugin wrapper buttons', async () => {
        await browser.url('https://webdriver.io')
        await browser.addLocatorStrategy('myStrat', (selector) => {
            return document.querySelectorAll(selector)
        })

        const pluginWrapper = await browser.custom$$('myStrat', '.pluginWrapper')

        console.log(await pluginWrapper.length) // 4
    })
 * </example>
 *
 * @alias custom$$
 * @param {string} strategyName
 * @param {*} strategyArguments
 * @return {ElementArray}
 */
export declare function custom$$(this: WebdriverIO.Browser, strategyName: string, ...strategyArguments: any[]): Promise<ElementArray>;
//# sourceMappingURL=custom$$.d.ts.map