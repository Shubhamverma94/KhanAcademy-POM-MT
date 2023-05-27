class Scroll {
    async scrollToTextAndClick(text, bookmarkIndex = 1) {
      await driver.pause(2000);
      await this.scrollIntoView(text);
      await this.clickBookmarkIcon(bookmarkIndex);
      await driver.pause(2000);
    }
  
    async scrollIntoView(text) {
      const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(text(\"${text}\"))`;
      await $(selector).click();
    }
  
    async clickBookmarkIcon(bookmarkIndex) {
      const selector = `(//android.widget.Button[@content-desc="Add Bookmark"])[${bookmarkIndex}]/android.widget.ImageView`;
      await $(selector).click();
    }
  
    async clickButtonByText(text) {
      const selector = `//*[@text="${text}"]`;
      await $(selector).click();
    }
  }
  
  module.exports = new Scroll();
  