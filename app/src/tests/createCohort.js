const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");
// Log4js is required for logging purposes
var log4js = require("log4js");
var logger = log4js.getLogger();
// Setting the log level to debug
logger.level = "debug";

// Defining the main function for testing the "create cohort" feature
async function test_case_createCohort() {
  // Creating a new browser instance using the Selenium WebDriver
  let driver = await new Builder().forBrowser("chrome").build();

  // Navigating to the login page
  await driver.get("http://localhost:3001/login");
  logger.info("webpage has been oppened");

  // Entering the username
  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[1]"))
    .sendKeys("mansoor@yahoo.com");
  logger.info("username added");

  // Entering the password and logging in
  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[2]"))
    .sendKeys("password123", Key.RETURN);
  logger.info("Loged in the page");

  // Setting the implicit wait time
  await driver.manage().setTimeouts({ implicit: 2000 });
  // Clicking on the dropdown menu
  await driver.findElement(By.id("dropdown-menu-align-end")).click();
  logger.info("Clieked dropdown");

  // Clicking on the "create cohort" button
  await driver.findElement(By.id("btn-create-cohort")).click();
  logger.info("Clicked Create Cohort");

  // Entering the cohort name
  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[1]"))
    .sendKeys("MCSP-20");
  logger.info("added Cohort Name");

// Entering the instructor name
  await driver
    .findElement(By.xpath("(//input[@class='form-control'])[2]"))
    .sendKeys("David");
  logger.info("added instructor");

// Entering the start date
  await driver
    .findElement(By.xpath("(//input[@class=''])[1]"))
    .sendKeys("02/20/2023", Key.RETURN);
  logger.info("added start date");

// Entering the end date
  await driver
    .findElement(By.xpath("(//input[@class=''])[2]"))
    .sendKeys("09/22/2023", Key.RETURN, Key.RETURN);
  logger.info("added end date");

// Submitting the form
  await driver
    .findElement(By.xpath("(//button[@class='btn btn-primary'])[2]"))
    .click();
  logger.info("submit clickecd");


  let result = driver.findElement(By.className("swal-text")).getText();

// Define an async function passFail that sets implicit timeouts and checks for the result
  async function passFail() {
    driver.manage().setTimeouts({ implicit: 2000 });
    let result = false;

   
    try {
       // Get the text of the element with class "swal-text"
      result = await driver.findElement(By.className("swal-text")).getText();
     // If the result equals "Cohort was succesfully created", log "test passed"
      if (result === "Cohort was succesfully created") {
        logger.info("test passed");
        return true;
      } else {
        // If the result is not as expected, take a screenshot and write it to the imgs folder
        driver.takeScreenshot().then(function (image) {
          require("fs").writeFileSync("./imgs/addCohort.png", image, "base64");
        });
      }
    } catch {
    // If an error occurs, log "test failed"
      console.log("test failed");
    }
    // Click the element with class "swal-text"
    await driver.findElement(By.className("swal-text")).click();
  }
// Call the passFail function
passFail();

// Click the button with class "swal-button swal-button--confirm" found by xpath
  await driver
    .findElement(
      By.xpath("(//button[@class='swal-button swal-button--confirm'])")
    )
    .click();
  logger.info("ok clicked for successful add");

  
// Set a timeout of 5000 milliseconds before quitting the browser
  setTimeout(function () {
    logger.debug("quitting browser");

    driver.quit();
  }, 5000);
}
// Call the test case createCohort
test_case_createCohort();
