const ClickFirstElement = require("../../Pages/ClickFirstElement");
const HomePage = require("../../Pages/HomePages");
const Scroll = require("../../Pages/Scroll");

describe("Testing Khan Academy", () => {
  it("Mobile Test WebdriveriO", async () => {
    await driver.pause(10000);

    await HomePage.dismissAlert();
    await HomePage.clickButtonByLocator("~Search");
      await HomePage.clickButtonByLocator("//*[@text='Computing']");
      await HomePage.clickButtonByLocator("//*[@text='Computer science']");
      await HomePage.clickButtonByLocator("//*[@text='Cryptography']");
      
    });
    
    it('Bookmark Click', async () => {

        await driver.pause(2000);
        await Scroll.scrollToTextAndClick("Ancient cryptography", 1);
        await Scroll.clickButtonByText("GOT IT");
        await Scroll.scrollToTextAndClick("Cryptography challenge 101", 2);
        await Scroll.scrollToTextAndClick("Modular arithmetic", 1);
        
        
    });
    
    it('Back to Computer Science', async() => {
        await driver.back(); // go back
        await driver.pause(2000);
        
        await HomePage.clickButtonByLocator("//*[@text='Information theory']");
        await driver.pause(2000);
        await Scroll.scrollToTextAndClick("Modern information theory", 1);
        
        
    });
    it('Tap on BookMark', async() => {
        
        await HomePage.clickButtonByLocator("//android.view.View[@content-desc='Bookmarks']/android.widget.ImageView");
        await driver.pause(2000);
       
        let ele1 = await $('//*[@text="Ancient cryptography"]').isExisting() ;
        let ele2 = await $('//*[@text="Cryptography challenge 101"]').isExisting() ;
        let ele3 = await $('//*[@text="Modular arithmetic"]').isExisting() ;
        let ele4 = await $('//*[@text="Information theory"]').isExisting() ;

        console.log("Ancient cryptography = " + ele1 + "\n" , "Cryptography challenge 101 = " + ele2+ "\n", "Modular arithmetic = " + ele3+ "\n", "Information theory = " +ele4 ) ;

        // const expectedNames = [
        //     "Ancient cryptography",
        //     "Cryptography challenge 101",
        //     "Modular arithmetic",
        //     "Information theory",
        //   ];
      
        //   // Verify bookmark names and count
        //   await ElementChecker.verifyBookmarkNames(expectedNames);
        
    });
    
    it('Clear All BookMark', async() => {
        await driver.pause(2000) ;
        await $('//*[@text="Edit"]').click() ;
        await driver.pause(2000) ;
        let arr = await $$('~Select bookmark') ;
        
        for( const ele of arr){
            await driver.pause(2000) ;
            await ele.click() ;
            
        }

        await $('//*[@text="Delete"]').click() ;

        await driver.pause(2000) ;
        let msg = await $('//*[@text="You have no bookmarks."]').isExisting() ;
        console.log(msg) ;
      
    });
    
  it('Play Video for 15 Seconds', async () => {
    await driver.back(); // go back
    await driver.pause(2000);
    await HomePage.clickButtonByLocator("~Search");
    await driver.pause(2000);
    await HomePage.clickButtonByLocator('//*[@text="Life skills"]');
    await driver.pause(2000);
    await HomePage.clickButtonByLocator('//*[@text="Financial Literacy"]');
    await driver.pause(2000);
    await ClickFirstElement.clickFirstElementByLocator('//android.widget.TextView[@text="Welcome to Financial Literacy"]');
    await driver.pause(2000);  
    await ClickFirstElement.clickFirstElementByLocator('//android.widget.TextView[@text="Welcome to Financial Literacy"]');
  
    await driver.pause(18000);
    await driver.back(); //go back
  
    console.log("Waited for 15 seconds for Video To Play");
  });
  
  it('Verify Recent Lessons', async() => {
    
    await HomePage.clickButtonByLocator('//android.widget.TextView[@text="Home"]');
    await driver.pause(2000);
    //verify Recent Lessons
    await HomePage.assertElementExists('//android.widget.TextView[@text="Recent lessons"]');
    await driver.pause(2000);
    //Verify Video topic
    await HomePage.assertElementExists('//android.widget.TextView[@text="Welcome to Financial Literacy"]');
    
  });
  
  it('Extra01:: Hybrid switch', async() => {
    
    await HomePage.clickButtonByLocator('//android.widget.ImageView[@content-desc="Settings"]');
    await driver.pause(2000);
    await HomePage.clickButtonByLocator('//android.widget.TextView[@text="Help & feedback"]');
    await driver.pause(2000);
    await HomePage.clickButtonByLocator('//android.widget.Button[@text="OPEN IN BROWSER"]');
    await driver.pause(2000);
     //switch between apps
     await driver.switchContext("WEBVIEW_chrome");
     await browser.pause(2000);
     const currentUrl = await driver.getUrl();
     expect(currentUrl).toEqual("https://support.khanacademy.org/hc/en-us");
     await browser.pause(10000);
    await driver.switchContext("NATIVE_APP");
    await driver.back(); // go back
     await browser.pause(2000);
    await driver.back(); // go back
     await browser.pause(2000);
     await HomePage.assertElementExists('//android.widget.TextView[@text="Ready to start learning?"]');
     await browser.pause(2000);
    });

    it('Extra02:: Changing Logo', async() => {
    
      await HomePage.clickButtonByLocator('//android.widget.ImageView[@content-desc="Settings"]');
      await driver.pause(2000);
      await HomePage.clickButtonByLocator('//android.widget.TextView[@text="App icon"]');
      await driver.pause(2000);
      await HomePage.clickButtonByLocator('//android.widget.TextView[@text="Midnight"]');
      await driver.pause(2000);
      await HomePage.assertElementText('//*[@resource-id="android:id/alertTitle"]',"Change icon to Khan Academy Midnight?");
      await driver.pause(2000);
      await HomePage.assertElementText('//*[@resource-id="android:id/message"]',"Changing the icon will close the app.");
      await driver.pause(2000);
      await HomePage.clickButtonByLocator('//android.widget.Button[@text="CANCEL"]');
      await driver.pause(2000);
      await driver.back(); //go back
      await driver.pause(2000);
      await driver.back(); //go back
      
    });
    
    it('Extra03:: Toggle buttons', async () => {
      await HomePage.clickButtonByLocator('//android.widget.ImageView[@content-desc="Settings"]');
      await driver.pause(2000);
      await HomePage.clickButtonByLocator('//android.widget.TextView[@text="Download settings"]');
      await driver.pause(2000);
      const switchButtons = await $$('android.widget.Switch');
      for (const button of switchButtons) {
        await button.click();
      }
      await driver.pause(2000);
  });

  it('Close the Application', async() => {
    
    await driver.pause(5000);
    console.log("Closing the Application")
      // Close the application
      await driver.closeApp();
  });
    
});