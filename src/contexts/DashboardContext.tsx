import { createContext, useContext, useState, useEffect, useRef } from "react"
import BigNumber from "bignumber.js"
import fetchTokenInfo from '@/helpers_dashboard/fetchTokenInfo'
import fetchTokenPriceUniV2 from '@/helpers_dashboard/fetchTokenPriceUniV2'
import fetchDepositsSummary from '@/helpers_dashboard/fetchDepositsSummary'
import fetchBurnSummary from '@/helpers_dashboard/fetchBurnSummary'
import fetchStakeSummary from '@/helpers_dashboard/fetchStakeSummary'


import {
  CHAIN_ID,
  TOKEN_ADDRESS,
  WETH_ADDRESS,
  USDT_ADDRESS,
  DEX_FACTORY_V2,
  DEPOSIT_CONTRACT,
  BURN_MANAGER_CONTRACT,
  STAKE_CONTRACT,
} from '@/config'

const DashboardContext = createContext({
  chainId: false,
  tokenAddress: false,
  
  tokenInfo: false,
  tokenInfoFetching: true,
  tokenInfoFetched: false,
  
  tokenPrice: false,
  tokenPriceFetching: true,
  tokenPriceFetched: false,
  
  depositsInfo: false,
  depositsInfoFetched: false,
  depositsInfoFetching: true,
  
  depGamesBank: new BigNumber(0),
  // Lotos banks
  lotoGameBank_1: new BigNumber(0),
  lotoGameBank_2: new BigNumber(0),
  lotoGameBank_3: new BigNumber(0),
  
  platformFee: 0,
  //
  burnInfo: false,
  burnInfoFetching: true,
  burnInfoFetched: false,
  
  //
  stakeInfo: false,
  stakeInfoFetched: false,
  stakeInfoFetching: true,
})

export const useDashboardContext = () => {
  return useContext(DashboardContext)
}


export default function DashboardProvider(props) {
  const {
    children,
    chainId
  } = props

  const [ tokenInfo, setTokenInfo ] = useState(false)
  const [ tokenInfoFetching, setTokenInfoFetching ] = useState(true)
  const [ tokenInfoFetched, setTokenInfoFetched ] = useState(false)
  
  useEffect(() => {
    setTokenInfoFetched(false)
    setTokenInfo(false)
    setTokenInfoFetching(true)
    fetchTokenInfo({
      chainId: CHAIN_ID,
      address: TOKEN_ADDRESS
    }).then(({ info }) => {
      setTokenInfo(info)
      setTokenInfoFetched(true)
      setTokenInfoFetching(false)
    }).catch((err) => {
      setTokenInfoFetching(false)
      console.error('Fail fetch token info', err)
    })
  }, [ CHAIN_ID, TOKEN_ADDRESS ])
  
  const [ tokenPrice, setTokenPrice ] = useState(false)
  const [ tokenPriceFetched, setTokenPriceFetched ] = useState(false)
  const [ tokenPriceFetching, setTokenPriceFetching ] = useState(true)
  
  useEffect(() => {
    setTokenPrice(false)
    setTokenPriceFetched(false)
    setTokenPriceFetching(true)
    fetchTokenPriceUniV2({
      chainId: CHAIN_ID,
      wEthAddress: WETH_ADDRESS,
      usdtAddress: USDT_ADDRESS,
      tokenAddress: TOKEN_ADDRESS,
      factoryAddress: DEX_FACTORY_V2,
    }).then((answer) => {
      const { price } = answer
      setTokenPrice(price)
      setTokenPriceFetching(false)
      setTokenPriceFetched(true)
    }).catch((err) => {
      console.log('Fail fetch token price', err)
      setTokenPriceFetching(false)
    })
  }, [ CHAIN_ID, TOKEN_ADDRESS, USDT_ADDRESS, DEX_FACTORY_V2 ])


  const [ depGamesBank, setDepGamesBank ] = useState(new BigNumber(0))
  const [ lotoGameBank_1, setLotoGameBank_1 ] = useState(new BigNumber(0))
  const [ lotoGameBank_2, setLotoGameBank_2 ] = useState(new BigNumber(0))
  const [ lotoGameBank_3, setLotoGameBank_3 ] = useState(new BigNumber(0))

  const [ platformFee, setPlatformFee ] = useState(0)
  
  const [ depositsInfo, setDepositsInfo ] = useState(false)
  const [ depositsInfoFetching, setDepositsInfoFetching ] = useState(true)
  const [ depositsInfoFetched, setDepositsInfoFetched ] = useState(false)
  
  useEffect(() => {
    setDepositsInfo(false)
    setDepositsInfoFetched(false)
    setDepositsInfoFetching(true)
    setDepGamesBank(new BigNumber(0))
    fetchDepositsSummary({
      chainId: CHAIN_ID,
      address: DEPOSIT_CONTRACT,
    }).then((answer) => {
      const {
        totalBankAmount,
        gamesInfo
      } = answer
      console.log('deposits answer', answer)
      let feeSum = 0
      gamesInfo.forEach(({ stakePercent, gasPercent, burnPercent }) => {
        feeSum = feeSum + Number(stakePercent) + Number(gasPercent) + Number(burnPercent)
      })
      setPlatformFee( feeSum / gamesInfo.length )

      setDepGamesBank(new BigNumber(totalBankAmount))
      setDepositsInfo(answer)
      setDepositsInfoFetched(true)
      setDepositsInfoFetching(false)
      
    }).catch((err) => {
      console.log('Fail fetch deposits contracts', err)
      setDepositsInfoFetching(false)
    })
  }, [ CHAIN_ID, DEPOSIT_CONTRACT ])
  
  const [ burnInfo, setBurnInfo ] = useState(false)
  const [ burnInfoFetched, setBurnInfoFetched ] = useState(false)
  const [ burnInfoFetching, setBurnInfoFething ] = useState(true)
  
  useEffect(() => {
    setBurnInfo(false)
    setBurnInfoFetched(false)
    setBurnInfoFething(true)
    
    fetchBurnSummary({
      chainId: CHAIN_ID,
      address: BURN_MANAGER_CONTRACT,
    }).then((answer) => {
      const {
        burnSummary
      } = answer
      setBurnInfo(burnSummary)
      setBurnInfoFetched(true)
      setBurnInfoFething(false)
      console.log('burn summary info', answer)
    }).catch((err) => {
      console.log('fail fetch burn summary', err)
      setBurnInfoFething(false)
    })
  }, [ CHAIN_ID, BURN_MANAGER_CONTRACT ])

  const [ stakeInfo, setStakeInfo ] = useState(false)
  const [ stakeInfoFetched, setStakeInfoFetched ] = useState(false)
  const [ stakeInfoFetching, setStakeInfoFetching ] = useState(true)
  
  useEffect(() => {
    setStakeInfo(false)
    setStakeInfoFetched(false)
    setStakeInfoFetching(true)
    fetchStakeSummary({
      chainId: CHAIN_ID,
      address: STAKE_CONTRACT,
    }).then((answer) => {
      const { info } = answer
      setStakeInfo(info)
      setStakeInfoFetched(true)
      setStakeInfoFetching(false)
      console.log('Stake summary', answer)
    }).catch((err) => {
      setStakeInfoFetching(false)
      console.log('fail fetch stake summary', err)
    })
  }, [ CHAIN_ID, STAKE_CONTRACT ])

  return (
    <DashboardContext.Provider value={{
      chainId: chainId,
      tokenAddress: TOKEN_ADDRESS,
      tokenInfo,
      tokenInfoFetching,
      tokenInfoFetched,
      
      tokenPrice,
      tokenPriceFetched,
      tokenPriceFetching,
      
      depositsInfo,
      depositsInfoFetched,
      depositsInfoFetching,
      
      burnInfo,
      burnInfoFetched,
      burnInfoFetching,

      stakeInfo,
      stakeInfoFetched,
      stakeInfoFetching,
      
      platformFee,

      depGamesBank,
      lotoGameBank_1,
      lotoGameBank_2,
      lotoGameBank_3,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}
