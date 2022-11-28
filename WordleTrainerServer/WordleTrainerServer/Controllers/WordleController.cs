using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WordleTrainerServer.Utils;
using WordleTrainerServer.WordObjects;
using WordleTrainerServer.Words;

namespace WordleTrainerServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WordleController : ControllerBase
    {
        static private string[] words = WordsProvider.Instance.Words;
        static private Random random = new();
        static private string currentWord = string.Empty;
        static private List<LetterGuess[]> currentInformation = new();
        static private List<string> guesses = new();

        [HttpGet("GetRandomWord")]
        public string GetRandomWord()
        {
            return words[random.Next(words.Length)];
        }

        [HttpGet("NewGame")]
        public string NewGame()
        {
            currentWord = GetRandomWord();
            currentInformation = new();
            guesses = new();
            return currentWord;
        }

        [HttpGet("GuessWord")]
        public LetterGuess[] GuessWord(string guess)
        {
            var info = GuessChecker.CheckGuess(currentWord, guess.ToLower());
            currentInformation.Add(info);
            guesses.Add(guess.ToLower());
            return info;
        }

        [HttpGet("Hint")]
        public string Hint()
        {
            return OptimalGuesser.Guess(currentInformation, guesses);
        }
    }
}
