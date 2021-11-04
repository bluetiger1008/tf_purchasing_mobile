import { useContext, createContext } from 'react'

export const PoListContext = createContext()

export const usePoListContext = () => useContext(PoListContext)
