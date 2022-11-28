using System.Text.RegularExpressions;
using WordleTrainerServer.WordObjects;
using WordleTrainerServer.Words;

namespace WordleTrainerServer.Utils
{
    public class OptimalGuesser
    {
        public static string Guess(List<LetterGuess[]> information, List<string> guesses)
        {
            var filter = new WordFilter(information, guesses);
            var pattern = filter.ToString();
            var notPresent = filter.NotPresentLetters();
            var present = filter.PresentLetters();
            var filteredWords = WordsProvider.Instance.Words.Where((word) => present.All(word.Contains) && Regex.IsMatch(word, notPresent) && Regex.IsMatch(word, pattern));

            var letterCounts = new int['z' - 'a' + 1];

            foreach (var word in filteredWords)
            {
                for (int i = 0; i < 5; i++)
                {
                    letterCounts[word[i] - 'a']++;
                }
            }

            var bestWord = "";
            var bestScore = 0;

            foreach (var word in filteredWords)
            {
                var score = 0;

                var unique = word.Distinct();

                foreach(var letter in unique)
                {
                    score += letterCounts[letter - 'a'];
                }

                if (score > bestScore)
                {
                    bestScore = score;
                    bestWord = word;
                }
            }

            return bestWord;
        }
    }
}
