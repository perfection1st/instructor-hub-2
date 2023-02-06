// Importing necessary modules from Selenium WebDriver
const { By, Key, Builder } = require("selenium-webdriver");
// Importing the chromedriver to use with selenium
require("chromedriver");

// Importing log4js for logging purposes
var log4js = require("log4js");
var logger = log4js.getLogger();
// Setting the log level to debug
logger.level = "debug";

// Defining the main function that performs the login test case
async function test_case_login() {
  // Building a new instance of Chrome browser using Selenium WebDriver
  let driver = await new Builder().forBrowser("chrome").build();

  // Navigating to the login page
  await driver.get("http://localhost:3001/login");
  logger.info("webpage has been opened");

  // Entering the email address in the username field
  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[1]"))
    .sendKeys("mansoor@yahoo.com");
  logger.info("username added");

  // Entering the password and hitting the return key to submit the form
  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[2]"))
    .sendKeys("password123", Key.RETURN);
  logger.info("Logged in the page");

  // Function to check if the login was successful
  async function example() {
    // Setting the implicit wait timeout to 2 seconds
    await driver.manage().setTimeouts({ implicit: 2000 });
    let result = false;
    try {
      // Checking if the dropdown element is displayed
      result = await driver.findElement(By.className("dropdown")).isDisplayed();
    } catch {
      console.log("test failed");
    }

    // If (true) the dropdown element is displayed, log a message saying test passed
    if (result) {
      logger.info("test passed");
    } else {
      // If the dropdown element is not displayed, take a screenshot and save it as an image file
      driver.takeScreenshot().then(function (image) {
        require("fs").writeFileSync("./imgs/login.png", image, "base64");
      });
    }
  }

  // Call the example function to check if the login was successful
  example();

  // Quit the browser after 5 seconds
  setTimeout(function () {
    logger.debug("quitting browser");

    driver.quit();
  }, 5000);
}

// Call the main function to start the test case
test_case_login();
