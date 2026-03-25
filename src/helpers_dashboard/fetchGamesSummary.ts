import GGWorldBingoGame from '@/abi/games/GGWorldBingoGame.json'
import GGWorldKenoGame from '@/abi/games/GGWorldKenoGame.json'
import FlipCoinGame from '@/abi/games/FlipCoinGame.json'
import CrashGame from '@/abi/games/CrashGame.json'

import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchGamesSummary = (options) => {
  const {
    chainId,
    games,
  } = {
    games: [],
    ...options
  }

  return new Promise((resolve, reject) => {
    const BingoEncoder = new AbiInterface(GGWorldBingoGame.abi)
    const KenoEncoder = new AbiInterface(GGWorldKenoGame.abi)
    const FlipCoinEncoder = new AbiInterface(FlipCoinGame.abi)
    const CrashGameEncoder = new AbiInterface(CrashGame.abi)

    const multicall = getMultiCall(chainId)

    let calls = {}
    games.forEach(({ type, address }) => {
      switch (type) {
        case 'KENO':
          calls = {
            ...calls,
            [`${type}_${address}_TOTAL`]: { func: 'gamesCount', target: address, encoder: KenoEncoder },
            [`${type}_${address}_WIN`]: { func: 'totalWinGamesCount', target: address, encoder: KenoEncoder },
            [`${type}_${address}_LOSS`]: { func: 'totalLostGamesCount', target: address, encoder: KenoEncoder },
          }
          break;
        case 'CRASH_GAME':
          calls = {
            ...calls,
            [`${type}_${address}_TOTAL`]: { func: 'totalBets', target: address, encoder: CrashGameEncoder },
            [`${type}_${address}_WIN`]: { func: 'totalCashOut', target: address, encoder: CrashGameEncoder },
          }
          break;
        case 'FLIP_COIN':
          calls = {
            ...calls,
            [`${type}_${address}_TOTAL`]: { func: 'gamesCount', target: address, encoder: FlipCoinEncoder },
            [`${type}_${address}_WIN`]: { func: 'wonGamesCount', target: address, encoder: FlipCoinEncoder },
            [`${type}_${address}_LOSS`]: { func: 'lostGamesCount', target: address, encoder: FlipCoinEncoder },
          }
          break
      }
    })
    callMulticall({
      multicall,
      calls,
    }).then((mcAnswer) => {
      let totalGames = 0
      let wonGames = 0
      let lostGames = 0

      games.forEach(({ type, address }) => {
        switch (type) {
          case 'KENO':
            totalGames += Number(mcAnswer[`${type}_${address}_TOTAL`])
            wonGames += Number(mcAnswer[`${type}_${address}_WIN`])
            lostGames += Number(mcAnswer[`${type}_${address}_LOSS`])
            break;
          case 'CRASH_GAME':
            totalGames += Number(mcAnswer[`${type}_${address}_TOTAL`])
            wonGames += Number(mcAnswer[`${type}_${address}_WIN`])
            lostGames += (Number(mcAnswer[`${type}_${address}_TOTAL`]) - Number(mcAnswer[`${type}_${address}_WIN`]))
            break;
          case 'FLIP_COIN':
            totalGames += Number(mcAnswer[`${type}_${address}_TOTAL`])
            wonGames += Number(mcAnswer[`${type}_${address}_WIN`])
            lostGames += Number(mcAnswer[`${type}_${address}_LOSS`])
            break
        }
      })
      console.log('Total, won, lost', totalGames, wonGames, lostGames)
      resolve({
        chainId,
        games,
        totalGames,
        wonGames,
        lostGames,
        wonRate: (wonGames / totalGames) * 100
      })
      
    }).catch((err) => {
      console.log('>>> Fail fetch all info', err)
      reject(err)
    })
    
  })
}

export default fetchGamesSummary