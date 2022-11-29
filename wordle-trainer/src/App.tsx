import './App.css'

import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { SettingsModal } from './components/modals/SettingsModal'
import { Navbar } from './components/navbar/Navbar'
import {
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
} from './constants/settings'
import {
  CORRECT_WORD_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
} from './constants/strings'
import { useAlert } from './context/AlertContext'
import {
  getStoredIsHighContrastMode,
  setStoredIsHighContrastMode,
} from './lib/localStorage'
import {
  getHint,
  getNewGame,
  guessWord,
  LetterGuess,
  unicodeLength
} from './lib/words'

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameDone, setIsGameDone] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isRevealing, setIsRevealing] = useState(false)
  
  const [guesses, setGuesses] = useState<{guess: string, letterGuesses: LetterGuess[]}[]>(() => {
    return []
  })

  const [loading, setLoading] = useState<boolean>(true)
  const [solution, setSolution] = useState<string>("     ")

  useEffect(() => {
    newGame()
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const newGame = async () => {
    setIsGameDone(false)
    setCurrentGuess('')
    setGuesses([])

    setLoading(true)
    setSolution('     ')
    const result = await getNewGame()
    setSolution(result)
    setLoading(false)
  }

  const hint = async () => {
    if (isGameDone) {
      return
    }
    const result = (await getHint()).toUpperCase()
    await guess(result)
    if(document.activeElement != null && document.activeElement.toString() == '[object HTMLButtonElement]'){ (document.activeElement as HTMLButtonElement).blur(); }
  }

  const guess = async (guess: string) => {
    if (!(unicodeLength(guess) === solution.length)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }
    
    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * solution.length)
    
    const winningWord = solution.toLowerCase() === guess.toLowerCase()
    
    if (guesses.length < MAX_CHALLENGES) {
      setGuesses([...guesses, {guess: guess, letterGuesses: await guessWord(guess)}])
      setCurrentGuess('')

      if (winningWord) {
        const winMessage = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
        const delayMs = REVEAL_TIME_MS * solution.length
        setIsGameDone(true)
        showSuccessAlert(winMessage, { delayMs })
      }
      else if (guesses.length === MAX_CHALLENGES - 1) {
        setIsGameDone(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), { delayMs: REVEAL_TIME_MS * solution.length + 1 })
      }
    }
  }

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameDone
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = async () => {
    if (isGameDone) {
      return
    }
    console.log(currentGuess)
    guess(currentGuess)
  }

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar setIsSettingsModalOpen={setIsSettingsModalOpen} />
        {isGameDone ? 
          <div className='flex w-full flex-col mx-auto justify-center'>
            <button 
              className='items-center justify-center rounded mx-0.5 text-xl font-bold cursor-pointer select-none dark:text-white bg-slate-300 dark:bg-slate-700' 
              style={{width: "fit-content", margin: "auto", padding: '10px', marginBottom: "20px"}}
              onClick={newGame}>
              New Game
            </button>
            <a 
              className='items-center justify-center rounded mx-0.5 text-3xl font-bold cursor-pointer select-none dark:text-white' 
              style={{width: "fit-content", margin: "auto", padding: '10px'}}
              href={`https://dictionary.cambridge.org/dictionary/english/` + solution} target="_blank" rel="noopener noreferrer">
              <u>{solution}</u>
            </a>
          </div>
        : (null)}
        {!loading ? (<div className="mx-auto w-full flex grow flex-col px-4 pt-2 pb-8">
          <div className='flex flex-col grow justify-center'>
            <div className="flex flex-col justify-center">
              <Grid
                solution={solution}
                guesses={guesses}
                currentGuess={currentGuess}
                isRevealing={isRevealing}
                currentRowClassName={currentRowClass}
                />
            </div>
            <button 
              className='items-center justify-center self-center rounded mx-0.5 text-xl font-bold cursor-pointer select-none dark:text-white bg-slate-300 dark:bg-slate-700' 
              style={{width: "fit-content", padding: '10px'}}
              onClick={hint}>
              Hint
            </button>
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}                  
            solution={solution}
            guesses={guesses}
            isRevealing={isRevealing}
          />
        </div>): (null)}
        <SettingsModal                                                            
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={isHighContrastMode}
          handleHighContrastMode={handleHighContrastMode}
        />
        <AlertContainer />
      </div>
    </Div100vh>
  )
}

export default App
