import TokenAbi from 'human-standard-token-abi'
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchTokenInfo = (options) => {
  const {
    address,
    chainId,
  } = {
    ...options
  }

  return new Promise((resolve, reject) => {
    const multicall = getMultiCall(chainId)
    const abiI = new AbiInterface(TokenAbi)

    callMulticall({
      multicall,
      target: address,
      encoder: abiI,
      calls: {
        decimals: { func: 'decimals' },
        symbol: { func: 'symbol' },
        name: { func: 'name' },
        totalSupply: { func: 'totalSupply' }
      }
    }).then((answer) => {
      const {
        decimals,
        symbol,
        name,
        totalSupply,
      } = answer

      resolve({
        chainId,
        address,
        info: {
          decimals,
          symbol,
          name,
          totalSupply
        }
      })
    }).catch((err) => {
      console.log('>>> Fail fetch all info', err)
      reject(err)
    })
  })
}

export default fetchTokenInfo