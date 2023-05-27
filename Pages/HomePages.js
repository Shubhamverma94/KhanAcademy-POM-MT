class HomePage {
    async dismissAlert() {
      const ele = await $("//android.widget.TextView[@text='Dismiss']");
      await ele.click();
    }
  
    async clickButtonByLocator(locator) {
        const element = await $(locator);
        await expect(element).toBeExisting();
        await element.click();
    }
    
    async clickButtonByText(buttonText) {
        const button = await $(`//android.widget.Button[@text='${buttonText}']`);
        await button.click();
  }
  
  async assertElementExists(locator) {
    const element1 = await $(locator);

    await expect(element1).toBeExisting();
  }

  async assertElementText(locator, expectedText) {
    const element = await $(locator);
    await expect(element).toBeExisting();
  
    const actualText = await element.getText();
    expect(actualText).toEqual(expectedText);
  }
  
  }
  
  module.exports = new HomePage();
  