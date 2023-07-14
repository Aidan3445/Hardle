using System;
using Allure.Net.Commons;
using NUnit.Framework;
using NUnit.Framework.Interfaces;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using PageObjects.PageObjects;
using Utils.Common;
using Utils.Reports;

namespace Tests.Common
{
    public class TestBase
    {
        // keyboard ordered alphabet
        protected const string QWERTY = "QWERTYUIOPASDFGHJKLZXCVBNM";

        // ensure that badGuess is not the Hardle Word for today.
        protected const string badGuess = "CANOE";
        
        protected IWebDriver Driver { get; private set; }

        protected HardlePage HardlePage { get; private set; }

        protected Browser Browser { get; private set; }

        protected AllureReporting AllureReport;

        [SetUp]
        public void SetUp()
        {
            // ExtentReporting.CreateTests(TestContext.CurrentContext.Test.MethodName);

            Driver = new ChromeDriver();
            Driver.Navigate().GoToUrl("https://hardle.netlify.app");
            // this.driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

            HardlePage = new HardlePage(Driver);

            AllureReport = new AllureReporting();
            Browser = new Browser(Driver);
        }

        [TearDown]
        public void TearDown()
        {
            EndTest();
            // ExtentReporting.EndReporting();
            Driver.Quit(); // driver quits after reporting ends bc live driver is needed for the screenshot
        }
        
        
        private void EndTest()
        {
            // Extent report (bugged)
            // var testStatus = TestContext.CurrentContext.Result.Outcome.Status;
            // var message = TestContext.CurrentContext.Result.Message;
            //
            // switch (testStatus)
            // {
            //     case TestStatus.Inconclusive:
            //         ExtentReporting.LogInfo($"Test inconclusive: {message}");
            //         break;
            //     case TestStatus.Skipped:
            //         ExtentReporting.LogInfo($"Test skipped: {message}");
            //         break;
            //     case TestStatus.Passed:
            //         break;
            //     case TestStatus.Warning:
            //         break;
            //     case TestStatus.Failed:
            //         ExtentReporting.LogFail($"Test failed: {message}");
            //         break;
            //     default:
            //         throw new ArgumentOutOfRangeException();
            // }
            //
            // ExtentReporting.LogScreenshot("Ending test.", Browser.GetScreenshot());

            // allure report
            var screenshot = Browser.SaveScreenshot();
            TestContext.AddTestAttachment(screenshot);
            AllureLifecycle.Instance.AddAttachment("ending test", "image/png", screenshot);
            

            
        }
    }
}