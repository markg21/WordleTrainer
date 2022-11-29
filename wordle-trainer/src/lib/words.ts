import axios from 'axios'
import { default as GraphemeSplitter } from 'grapheme-splitter'

// 1 January 2022 Game Epoch
export const firstGameDate = new Date(2022, 0)
export const periodInDays = 1

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

export const getNewGame = async () => {
  const res = await axios.request<string>({
    method: "GET",
    withCredentials: false,
    url: `http://localhost:5087/Wordle/NewGame`
  })

  return res.data
}

export enum LetterGuess {
  Miss = 0,
  WrongPlace = 1,
  Correct = 2
}

export const guessWord = async (guess: string) => {
  const res = await axios.request<LetterGuess[]>({
    method: "GET",
    withCredentials: false,
    url: `http://localhost:5087/Wordle/GuessWord?guess=` + guess
  })

  return res.data
}

export const getHint = async () => {
  const res = await axios.request<string>({
    method: "GET",
    withCredentials: false,
    url: `http://localhost:5087/Wordle/Hint`
  })

  return res.data
}