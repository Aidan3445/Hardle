using System;
using System.Collections;
using System.Threading;
using NUnit.Allure.Attributes;
using NUnit.Allure.Core;
using NUnit.Framework;
using OpenQA.Selenium;
using Tests.Common;

namespace Tests.Tests
{
    [AllureNUnit]
    public class AllureReportTests : TestBase
    {
        [Test]
        [AllureDescription("Check that QWERTY DOM keys enter correctly.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void DOMKeyboardTest()
        {
            foreach (var key in QWERTY)
            {
                AllureReport.LogStep($"enter {key} key (DOM).");
                HardlePage.PressKeyDOM(key.ToString());

                Assert.That(HardlePage.GetTile(0, 0), Is.EqualTo(key.ToString()));

                HardlePage.DeleteDOM();
            }
        }

        [Test]
        [AllureDescription("Check that backspace DOM key deletes correctly.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void DOMDeleteKeyTest()
        {
            var randomLetter = QWERTY[new Random().Next(0, 26)];

            AllureReport.LogStep($"enter {randomLetter} key and then delete (DOM).");
            HardlePage.PressKeyDOM(randomLetter.ToString()).DeleteDOM();

            Assert.That(HardlePage.GetTile(0, 0), Is.EqualTo(""));
        }

        [Test]
        [AllureDescription("Check that guesses are entered correctly with the DOM keyboard.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void DOMMakeGuessTest()
        {
            AllureReport.LogStep($"enter guess: {badGuess} (DOM).");
            HardlePage.MakeGuessDOM(badGuess);

            Assert.That(HardlePage.GetGuess(0), Is.EqualTo(badGuess));
        }

        [Test]
        [AllureDescription("Check that physical keys enter correctly.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void KeyboardTest()
        {
            foreach (var key in QWERTY)
            {
                AllureReport.LogStep($"enter {key} key (physical).");
                HardlePage.PressKey(key.ToString());

                Assert.That(HardlePage.GetTile(0, 0), Is.EqualTo(key.ToString()));

                HardlePage.Delete();
            }
        }

        [Test]
        [AllureDescription("Check that backspace physical key deletes correctly.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void DeleteKeyTest()
        {
            var randomLetter = QWERTY[new Random().Next(0, 26)];

            AllureReport.LogStep($"enter {randomLetter} key and then delete (physical).");
            HardlePage.PressKey(randomLetter.ToString()).Delete();

            // check that the delete key worked
            Assert.That(HardlePage.GetTile(0, 0), Is.EqualTo(""));
        }

        [Test]
        [AllureDescription("Check that guesses are entered correctly with the physical keyboard.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void MakeGuessTest()
        {
            AllureReport.LogStep($"enter guess: {badGuess} (physical).");
            HardlePage.MakeGuess(badGuess);

            Assert.That(HardlePage.GetGuess(0), Is.EqualTo(badGuess));
        }

        [Test]
        [AllureDescription("Check that reset button is displayed when guesses are made.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void GuessResetUIUpdateTest()
        {
            AllureReport.LogStep($"type guess: {badGuess}.");
            HardlePage.MakeGuess(badGuess);

            Assert.That(HardlePage.GetTrashCanDisplay(0), Is.EqualTo(false));

            AllureReport.LogStep("enter guess.");
            HardlePage.Enter();

            Assert.That(HardlePage.GetTrashCanDisplay(0), Is.EqualTo(true));
        }

        [Test]
        [AllureDescription("Check that pegs are colored when guesses are made.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        // note this test does not confirm that colorings are correct, just that they are non-white and ordered:
        // Yellows first, Greens second, Grays last.
        public void GuessPegUIUpdateTest()
        {
            AllureReport.LogStep($"type guess: {badGuess}");
            HardlePage.MakeGuess(badGuess);

            var pegColors = HardlePage.GetPegColors(0);
            var allWhite = new string[5];
            Array.Fill(allWhite, PegColor.White);
            // pegs should be all white before guess is entered
            Assert.That(pegColors, Is.EqualTo(allWhite));

            AllureReport.LogStep("enter guess");
            HardlePage.Enter();
            
            // convert peg colors to an index (0 = yellow, 1 = green, 2 = grey)
            pegColors = HardlePage.GetPegColors(0);
            var colorIndexArray = new ArrayList();
            foreach (var peg in pegColors)
            {
                switch (peg)
                {
                    case PegColor.Yellow:
                        colorIndexArray.Add(0);
                        break;
                    case PegColor.Green:
                        colorIndexArray.Add(1);
                        break;
                    case PegColor.Grey:
                        colorIndexArray.Add(2);
                        break;
                }
            }
            
            AllureReport.LogStep($"peg color indices: {colorIndexArray}");

            // white pegs were not counted so if all pegs are colored there should be 5 in the array
            Assert.That(colorIndexArray.Count, Is.EqualTo(5));
            // the array should be sorted as yellow always comes before green which comes before grey
            CollectionAssert.IsOrdered(colorIndexArray);
        }

        [Test]
        [AllureDescription("Check that the end screen displays that the game was lost and chart bars are grey.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void LoseGameTests()
        {
            // test that endscreen is hidden at game start
            Assert.IsFalse(HardlePage.EndScreenDisplayed());

            AllureReport.LogStep($"Enter 9 bad guesses: {badGuess}.");
            for (int i = 0; i < 9; i++)
            {
                HardlePage.MakeGuess(badGuess);
                HardlePage.Enter();
            }

            // test tha  endscreen is shown after 9 wrong guesses
            Assert.IsTrue(HardlePage.EndScreenDisplayed());

            var chartBars = HardlePage.GetChartBars();
        
            foreach (var bar in chartBars)
                Assert.That(bar.GetCssValue("background-color"), Is.EqualTo("rgba(185, 185, 185, 1)"));
        }
        
        [Test]
        [AllureDescription("Check that the end screen displays that the game was won and correct bar is green.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void WinGameTest()
        {
            AllureReport.LogStep("Get hardle word.");
            // lose game and grab correct word
            var hardle = HardlePage.GetHardleWord(badGuess, AllureReport);
            AllureReport.LogStep($"Hardle word is: {hardle}.");
        
            // test winning in each number of guesses 1-9
            var badGuessCount = new Random().Next(9);
        
            AllureReport.LogStep($"Make {badGuessCount} bad guesses followed by the correct guess.");
            // make wrong guess(es) followed by correct one
            for (int i = 0; i < badGuessCount; i++)
            {
                HardlePage.MakeGuess(badGuess);
                HardlePage.Enter();
            }

            HardlePage.MakeGuess(hardle);
            HardlePage.Enter();


            var chartBars = HardlePage.GetChartBars();
            Assert.That(chartBars[badGuessCount].GetCssValue("background-color"),
                Is.EqualTo(PegColor.Green));
        }
        
        [Test]
        [Apartment(ApartmentState.STA)]
        [AllureDescription("Check that share button correctly copies the score.")]
        [AllureIssue("Issue-1")]
        [AllureTms("TMS-1")]
        public void ShareButtonTests()
        {
            AllureReport.LogStep("Get hardle word.");
            // lose game and grab correct word
            var hardle = HardlePage.GetHardleWord(badGuess, AllureReport);
            AllureReport.LogStep($"Hardle word is: {hardle}.");
        
            // test winning in each number of guesses 1-9
            var badGuessCount = new Random().Next(9);
        
            AllureReport.LogStep($"Make {badGuessCount} bad guesses followed by the correct guess.");
            // make wrong guess(es) followed by correct one
            for (int i = 0; i < badGuessCount; i++)
            {
                HardlePage.MakeGuess(badGuess);
                HardlePage.Enter();
            }

            HardlePage.MakeGuess(hardle);
            HardlePage.Enter();

            // test that shareButton is displayed and has correct text
            Assert.IsTrue(HardlePage.ShareButtonDisplayed());
            
            AllureReport.LogStep("Click share button.");
            HardlePage.ClickShareButton();
            
            // test popup
            Assert.That(HardlePage.GetPopupText(), Is.EqualTo("Copied to clipboard"));

            HardlePage.PasteClipBoard();
            
            var pasted = HardlePage.GetPasted();
            
            // test correct line count
            var guesses = pasted.Split("\n").Length;
            Assert.That(guesses, Is.EqualTo(badGuessCount + 3));
        }
    }
}