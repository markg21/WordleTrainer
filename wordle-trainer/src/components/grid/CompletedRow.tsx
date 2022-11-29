import { LetterGuess, unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solution: string
  guess: {guess: string, letterGuesses: LetterGuess[]}
  isRevealing?: boolean
}

export const CompletedRow = ({ guess, isRevealing }: Props) => {
  const statuses = guess.letterGuesses
  const splitGuess = unicodeSplit(guess.guess)

  return (
    <div className="mb-1 flex justify-center">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}
