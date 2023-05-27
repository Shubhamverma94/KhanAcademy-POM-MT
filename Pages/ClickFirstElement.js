class ClickFirstElement {
    async clickFirstElementByLocator(locator) {
      const elements = await $$(locator);
  
      if (elements.length > 0) {
        const firstElement = elements[0];
        await firstElement.click();
      } else {
        throw new Error(`No elements found with locator '${locator}'`);
      }
    }
  }
  
  module.exports = new ClickFirstElement();
  
  