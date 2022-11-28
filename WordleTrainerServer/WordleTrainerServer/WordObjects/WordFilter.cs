using Microsoft.VisualBasic;

namespace WordleTrainerServer.WordObjects
{
    public class WordFilter
    {
        private char[] exact;
        private List<List<char>> present;
        private List<char> notPresent;
        private List<char> exists;

        public WordFilter(List<LetterGuess[]> letterGuesses, List<string> guesses)
        {
            exact = "     ".ToArray();
            present = new(5) { new(), new(), new(), new(), new() };
            notPresent = new();
            exists = new();

            for (int i = 0; i < letterGuesses.Count; i++)
            {
                addGuess(letterGuesses[i], guesses[i]);
            }
        }

        public WordFilter(WordFilter filter, LetterGuess[] letterGuesses, string guess)
        {
            this.exact = new char[5];
            filter.exact.CopyTo(exact, 0);

            this.notPresent = filter.notPresent.ToList();
            this.present = filter.present.Select(list => list.ToList()).ToList();

            addGuess(letterGuesses, guess);
        }

        private void addGuess(LetterGuess[] letterGuesses, string guess)
        {
            for (int j = 0; j < 5; j++)
            {
                if (letterGuesses[j] == LetterGuess.Correct)
                {
                    exact[j] = guess[j];

                    if (!exists.Contains(guess[j]))
                        exists.Add(guess[j]);
                }
                else if (letterGuesses[j] == LetterGuess.WrongPlace)
                {
                    present[j].Add(guess[j]);

                    if (!exists.Contains(guess[j]))
                        exists.Add(guess[j]);
                }
                else if (!exact.Contains(guess[j]) && !present.Any(letters => letters.Contains(guess[j])) && !notPresent.Contains(guess[j]))
                {
                    notPresent.Add(guess[j]);
                }
            }
        }

        public override string ToString()
        {
            string pattern = "";

            for (int i = 0; i < 5; i++)
            {
                if (exact[i] != ' ')
                    pattern += exact[i].ToString();
                else if (present[i].Any())
                    pattern += "[^" + String.Concat(present[i]) + "]";
                else
                    pattern += ".";
            }

            return pattern;
        }

        public string NotPresentLetters()
        {
            return notPresent.Any() ? "^((?![" + String.Concat(notPresent) + "]).)*$" : "";
        }

        public string PresentLetters()
        {
            return exists.Any() ? String.Concat(exists) : "";
        }
    }
}
