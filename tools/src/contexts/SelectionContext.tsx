import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SelectionContextType {
  selectedFishIds: Set<string>
  setSelectedFishIds: (ids: Set<string>) => void
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined)

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFishIds, setSelectedFishIds] = useState<Set<string>>(new Set())

  return (
    <SelectionContext.Provider value={{ selectedFishIds, setSelectedFishIds }}>
      {children}
    </SelectionContext.Provider>
  )
}

export const useSelection = () => {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider')
  }
  return context
}