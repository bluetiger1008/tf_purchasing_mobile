import React, { useContext, createContext } from 'react'

export const RfqListContext = createContext()

export const useRfqListContext = () => useContext(RfqListContext)
