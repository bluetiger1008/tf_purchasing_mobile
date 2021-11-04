import React, { useContext, createContext } from 'react'

export const CorrespondenceContext = createContext()

export const useCorrespondenceContext = () => useContext(CorrespondenceContext)
