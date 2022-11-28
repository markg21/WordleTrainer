namespace WordleTrainerServer.Words
{
    public class WordsProvider
    {
        public static WordsProvider Instance { get; }

        public string[] Words { get; private set; }

        private WordsProvider()
        {
            Words = File.ReadAllLines("./Words/Words.txt");
        }

        static WordsProvider()
        {
            Instance = new WordsProvider();
        }
    }
}
