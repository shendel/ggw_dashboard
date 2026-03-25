import { createContext, useContext, useState, useEffect, useRef } from "react"
import BigNumber from "bignumber.js"


const DashboardContext = createContext({
  chainId: false
})

export const useDashboardContext = () => {
  return useContext(DashboardContext)
}

export default function DashboardProvider(props) {
  const {
    children,
    chainId
  } = props

  return (
    <DashboardContext.Provider value={{
      chainId: chainId,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}
