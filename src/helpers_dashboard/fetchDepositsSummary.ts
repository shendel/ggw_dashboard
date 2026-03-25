import DepositsJson from "@/abi/GGWDeposit.json"
import MulticallAbi from '@/abi/MulticallAbi.json'
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchDepositsSummary = (options) => {
  const {
    address,
    chainId,
  } = {
    ...options
  }

  return new Promise((resolve, reject) => {
    const DepositsAbi = DepositsJson.abi

    const multicall = getMultiCall(chainId)
    const multicallAddress = getMultiCallAddress(chainId)
    const mcI = new AbiInterface(MulticallAbi)
    const abiI = new AbiInterface(DepositsAbi)

    callMulticall({
      multicall,
      target: address,
      encoder: abiI,
      calls: {
        usersCount:             { func: 'usersCount' },
        gamesCount:             { func: 'gamesCount' },
        totalDepositAmount:     { func: 'totalDepositAmount' },
        totalBankAmount:        { func: 'totalBankAmount' },
        minWithdrawAmount:      { func: 'minWithdrawAmount' },
        gamesInfo:              { func: 'getGames', args: [0, 0] },
        blockNumber:            { func: 'getBlockNumber', target: multicallAddress, encoder: mcI },
        blockTimeStamp:         { func: 'getCurrentBlockTimestamp', target: multicallAddress, encoder: mcI },
      }
    }).then((mcAnswer) => {
      
      resolve({
        chainId,
        address,
        ...mcAnswer,
      })
      console.log('>>> summary', mcAnswer)
    }).catch((err) => {
      console.log('>>> Fail fetch all info', err)
      reject(err)
    })
  })
}

export default fetchDepositsSummary