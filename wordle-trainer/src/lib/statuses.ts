import { LetterGuess, unicodeSplit } from './words'

export const getStatuses = (
  guesses: {guess: string, letterGuesses: LetterGuess[]}[]
): { [key: string]: LetterGuess } => {
  const charObj: { [key: string]: LetterGuess } = {}

  guesses.forEach((guess) => {
    unicodeSplit(guess.guess).forEach((letter, i) => {
      if (guess.letterGuesses[i] == LetterGuess.Correct) {
        //make status correct
        return (charObj[letter] = LetterGuess.Correct)
      }
      
      if (guess.letterGuesses[i] == LetterGuess.WrongPlace && (!(letter in charObj) || charObj[letter] == LetterGuess.Miss)) {
        //make status present
        return (charObj[letter] = LetterGuess.WrongPlace)
      }

      if (!(letter in charObj) && guess.letterGuesses[i] == LetterGuess.Miss) {
        // make status absent
        return (charObj[letter] = LetterGuess.Miss)
      }
    })
  })

  return charObj
}
