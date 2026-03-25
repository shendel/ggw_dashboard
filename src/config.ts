import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { NEXT_PUBLIC_PROJECT_ID } = publicRuntimeConfig

export const TITLE = publicRuntimeConfig?.TITLE || 'GGW Dashboard'
export const SEO_DESC = publicRuntimeConfig?.SEO_DESC || ""

export const MAINNET_CHAIN_ID = publicRuntimeConfig?.CHAIN_ID || 56

export const CHAIN_ID = publicRuntimeConfig?.CHAIN_ID || 56

export const INITIAL_SUPPLY = publicRuntimeConfig?.INITIAL_SUPPLY || '756011584'
export const STAKE_TARGET = publicRuntimeConfig?.STAKE_TARGET || '2000000'

export const TOKEN_ADDRESS = publicRuntimeConfig?.TOKEN_ADDRESS || '0xCA84fcA8cd0E45bCabEef624f7E500f60Da1E771'
export const WETH_ADDRESS = publicRuntimeConfig?.WETH_ADDRESS || '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const USDT_ADDRESS = publicRuntimeConfig?.USDT_ADDRESS || '0x55d398326f99059fF775485246999027B3197955'
export const DEX_FACTORY_V2 = publicRuntimeConfig?.DEX_FACTORY_V2 || '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'

export const DEPOSIT_CONTRACT = publicRuntimeConfig?.DEPOSIT_CONTRACT || '0xb402085fe60BCAEd082a633aE53e9c2ba8EEbE01'
export const BURN_MANAGER_CONTRACT = publicRuntimeConfig?.BURN_MANAGER_CONTRACT || '0x6dB7155254789481B72078BbDd2C94b9Bda65fc6'
export const STAKE_CONTRACT = publicRuntimeConfig?.STAKE_CONTRACT || '0x3E55901F6Cc424Acb9169593a42D0EBf6322171D'
