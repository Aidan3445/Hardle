using NUnit.Framework;
using Tests.Common;

namespace Tests.Tests
{
    public class HardleTests : TestBase
    {
        // [Test]
        public void GuessWordTest()
        {
            // ExtentReporting.LogInfo("Starting test - Guess Word");
            
            var guess = "HELLO";

            HardlePage.MakeGuess(guess);

            Assert.That(HardlePage.GetGuess(0), Is.EqualTo(guess));
        }
        
        // [Test]
        public void GuessWordNegativeTest()
        {
            // ExtentReporting.LogInfo("Starting negative test - Guess Word");
            
            var guess = "HOWDY";

            for (var i = 0; i < 5; i++) HardlePage.PressKey(guess.Substring(i, 1));

            Assert.That(HardlePage.GetGuess(1), Is.EqualTo(guess)); //incorrect index
        }
    }
}