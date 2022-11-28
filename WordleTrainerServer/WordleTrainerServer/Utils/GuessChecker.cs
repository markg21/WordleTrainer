using WordleTrainerServer.WordObjects;

namespace WordleTrainerServer.Utils
{
    public class GuessChecker
    {
        public static LetterGuess[] CheckGuess(string word, string guess)
        {
            LetterGuess[] guesses = new LetterGuess[word.Length];
            var wordCopy = new Span<char>(word.ToArray());

            for (char i = 'a'; i <= 'z'; i++)
            {
                var res = guess.Select((b, x) => b == i ? x : -1).Where(i => i != -1).ToArray();

                if (res.Length == 0)
                    continue;

                foreach(var item in res)
                {
                    if (wordCopy[item] == guess[item])
                    {
                        guesses[item] = LetterGuess.Correct;
                        wordCopy[item] = '\0';
                    }
                }

                foreach(var item in res)
                {
                    if (guesses[item] != LetterGuess.Correct)
                    {
                        if (wordCopy.Contains(guess[item]))
                        {
                            wordCopy[wordCopy.IndexOf(guess[item])] = '\0';
                            guesses[item] = LetterGuess.WrongPlace;
                        }
                    }
                }
            }

            return guesses;
        }
    }
}
