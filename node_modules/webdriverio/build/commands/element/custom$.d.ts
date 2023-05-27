/**
 *
 * The `custom$` allows you to use a custom strategy declared by using `browser.addLocatorStrategy`
 *
 * <example>
    :example.js
    it('should fetch the project title', async () => {
        await browser.url('https://webdriver.io')
        await browser.addLocatorStrategy('myStrat', (selector) => {
            return document.querySelectorAll(selector)
        })

        const header = await browser.custom$('myStrat', 'header')
        const projectTitle = await header.custom$('myStrat', '.projectTitle')

        console.log(projectTitle.getText()) // WEBDRIVER I/O
    })
 * </example>
 *
 * @alias custom$
 * @param {string} strategyName
 * @param {*} strategyArguments
 * @return {Element}
 */
export declare function custom$(this: WebdriverIO.Element, strategyName: string, ...strategyArguments: any[]): Promise<WebdriverIO.Element>;
//# sourceMappingURL=custom$.d.ts.map