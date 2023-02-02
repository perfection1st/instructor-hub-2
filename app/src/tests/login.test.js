const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";

async function test_case_login() {
  let driver = await new Builder().forBrowser("chrome").build();

  await driver.get("http://localhost:3001/login");
  logger.info("webpage has been oppened");

  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[1]"))
    .sendKeys("mansoor@yahoo.com");
  logger.info("username added");

  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[2]"))
    .sendKeys("password23", Key.RETURN);
  logger.info("Loged in the page");

  async function example() {
    await driver.manage().setTimeouts({ implicit: 2000 });
    let result = false;
    try {
      result = await driver.findElement(By.className("dropdown")).isDisplayed();
    } catch {
      console.log("test failed");
    }

    if (result) {
      logger.info("test passed");
    } else {
      driver.takeScreenshot().then(function (image) {
        require("fs").writeFileSync("./imgs/login.png", image, "base64");
      });
    }
  }

  example();

  setTimeout(function () {
    logger.debug("quitting browser");

    driver.quit();
  }, 5000);
}

test_case_login();

