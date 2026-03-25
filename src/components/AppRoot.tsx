import { useState, useEffect } from 'react'

import ModalProvider from "@/contexts/ModalContext";
import NotificationProvider from "@/contexts/NotificationContext"
import DashboardProvider from '@/contexts/DashboardContext'

import NETWORKS from '@/constants/NETWORKS'
import {
  MAINNET_CHAIN_ID,
  MAINNET_CONTRACT,
} from '@/config'

export default function AppRoot(props) {
  const {
    children,
  } = props

  const chainId = MAINNET_CHAIN_ID

  return (
    <>
      <NotificationProvider>
        <DashboardProvider chainId={MAINNET_CHAIN_ID}>
          <ModalProvider>
            {children}
          </ModalProvider>
        </DashboardProvider>
      </NotificationProvider>
    </>
  )
}