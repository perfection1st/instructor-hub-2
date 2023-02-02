
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
    .sendKeys("password123", Key.RETURN);
  logger.info("Loged in the page");

  await driver.manage().setTimeouts({ implicit: 2000 });
  await driver
  .findElement(By.id("dropdown-menu-align-end")).click();
 
//logger.info("username added");
await driver.manage().setTimeouts({ implicit: 2000 });
await driver
.findElement(By.id("btn-create-cohort")).click();

//logger.info("username added");

await driver
.findElement(By.xpath("(//input[@class='form-control'])[1]"))
.sendKeys("MCSP-18");
//logger.info("username added");

await driver
.findElement(By.xpath("(//input[@class='form-control'])[2]"))
.sendKeys("David");
//logger.info("username added");

await driver
.findElement(By.xpath("(//input[@class=''])[1]"))
.sendKeys("02/20/2023", Key.RETURN);
//logger.info("Loged in the page");
await driver.manage().setTimeouts({ implicit: 2000 });

await driver
.findElement(By.xpath("(//input[@class=''])[2]"))
.sendKeys("09/22/2023", Key.RETURN, Key.RETURN);
//logger.info("username added");

await driver.manage().setTimeouts({ implicit: 2100 });
await driver
.findElement(By.xpath("(//button[@class='btn btn-primary'])[2]")).click();



  async function example() {
    await driver.manage().setTimeouts({ implicit: 2000 });
    let result = false;
    try {
      result = await driver.findElement(By.className("swal-text")).isDisplayed();
    } catch {
      console.log("test failed");
    }

    if (result) {
      logger.info("test passed");
    } else {
      driver.takeScreenshot().then(function (image) {
        require("fs").writeFileSync("./imgs/addCohort.png", image, "base64");
      });
    }

    await driver.manage().setTimeouts({ implicit: 2100 });
await driver
.findElement(By.className("swal-text")).click();
  }

  example();

  setTimeout(function () {
    logger.debug("quitting browser");

    driver.quit();
  }, 5000);
}

test_case_login();