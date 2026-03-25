import TokenAbi from 'human-standard-token-abi'
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const FACTORY_ABI = [{"constant": true,"inputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "address","name": "","type": "address"}],"name": "getPair","outputs": [{"internalType": "address","name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"}]
const PAIR_ABI = [
  { "name": "getReserves", "constant": true, "inputs": [], "outputs": [ {"internalType": "uint112","name": "_reserve0", "type": "uint112" }, { "internalType": "uint112", "name": "_reserve1", "type": "uint112" }, { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" } ], "payable": false, "stateMutability": "view", "type": "function" },
  { "name": "token0", "constant": true, "inputs": [], "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" },
  { "name": "token1", "constant": true, "inputs": [], "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" },
]

const fetchTokenPriceUniV2 = (options) => {
  const {
    chainId,
    wEthAddress,
    usdtAddress,
    tokenAddress,
    factoryAddress,
    WETH_DECIMALS,
  } = {
    WETH_DECIMALS: 18,
    ...options
  }

  return new Promise((resolve, reject) => {
    const multicall = getMultiCall(chainId)
    const factoryImterface = new AbiInterface(FACTORY_ABI)
    const tokenInterface = new AbiInterface(TokenAbi)
    const pairInterface = new AbiInterface(PAIR_ABI)
    
    callMulticall({
      multicall,
      target: factoryAddress,
      encoder: factoryImterface,
      calls: {
        tokenPair: { func: 'getPair', args: [ wEthAddress, tokenAddress ] },
        usdtPair: { func: 'getPair', args: [ wEthAddress, usdtAddress ] },
        usdtDecimals: { func: 'decimals', target: usdtAddress, encoder: tokenInterface },
        usdtSymbol: { func: 'symbol', target: usdtAddress, encoder: tokenInterface },
        tokenDecimals: { func: 'decimals', target: tokenAddress, encoder: tokenInterface },
      }
    }).then((answer) => {
      const {
        tokenPair,
        usdtPair,
        usdtDecimals,
        tokenDecimals,
      } = answer
      callMulticall({
        multicall,
        calls: {
          tokenReserve: { func: 'getReserves', target: tokenPair, encoder: pairInterface },
          usdtReserve: { func: 'getReserves', target: usdtPair, encoder: pairInterface },
        }
      }).then((answer) => {
        const {
          tokenReserve,
          usdtReserve
        } = answer
        const usdtReserveIn = fromWei(usdtReserve._reserve1, usdtDecimals)
        const usdtReserveOut = fromWei(usdtReserve._reserve0, WETH_DECIMALS)
        
        const wEthPrice = parseFloat(usdtReserveOut) / parseFloat(usdtReserveIn);

        const tokenReserveIn = fromWei(tokenReserve._reserve1, tokenDecimals)
        const tokenReserveOut = fromWei(tokenReserve._reserve0, WETH_DECIMALS)


        const tokenEthPrice = parseFloat(tokenReserveOut) / parseFloat(tokenReserveIn)

        const priceInUSDT = tokenEthPrice * wEthPrice
        
        resolve({
          price: priceInUSDT
        })
      }).catch((err) => {
        console.log('Fail fetch pair reserves', err)
        reject(err)
      })
    }).catch((err) => {
      console.log('fail', err)
      reject(err)
    })
    
  })
}

export default fetchTokenPriceUniV2
/*
const TOKEN_ADDRESS = ajax_obj.token_address
    const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
    const PANCAKE_FACTORY_V2 = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';

    // ABIs
    const FACTORY_ABI = ['function getPair(address tokenA, address tokenB) external view returns (address)'];
    const PAIR_ABI = [
      'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32)',
      'function token0() view returns (address)',
      'function token1() view returns (address)'
    ];
    const ERC20_ABI = ['function decimals() view returns (uint8)'];
    const getTokenDecimals = async (provider, tokenAddr) => {
      const contract = new ethers.Contract(tokenAddr, ERC20_ABI, provider);
      return await contract.decimals();
    }

    const getPriceFromPool = async (provider, poolAddress, tokenIn, tokenOut, decimalsIn, decimalsOut) => {
      const pair = new ethers.Contract(poolAddress, PAIR_ABI, provider);
      const [token0, token1] = await Promise.all([pair.token0(), pair.token1()]);
      const reserves = await pair.getReserves();

      let reserveIn, reserveOut;

      if (token0.toLowerCase() === tokenIn.toLowerCase()) {
        reserveIn = ethers.utils.formatUnits(reserves.reserve0, decimalsIn);
        reserveOut = ethers.utils.formatUnits(reserves.reserve1, decimalsOut);
      } else if (token1.toLowerCase() === tokenIn.toLowerCase()) {
        reserveIn = ethers.utils.formatUnits(reserves.reserve1, decimalsIn);
        reserveOut = ethers.utils.formatUnits(reserves.reserve0, decimalsOut);
      } else {
        throw new Error('Токен не найден в пуле');
      }

      return parseFloat(reserveOut) / parseFloat(reserveIn);
    }
    const priceHolder = document.querySelector('[data-token-info="price"]')
    if (priceHolder) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          chainRPC[ajax_obj.token_chainId]
        );

        // 1. Получаем decimals токена
        const tokenDecimals = await getTokenDecimals(provider, TOKEN_ADDRESS);
        console.log('Decimals:', tokenDecimals);

        // 2. Находим пул TOKEN/WBNB
        const factory = new ethers.Contract(PANCAKE_FACTORY_V2, FACTORY_ABI, provider);
        const poolAddress = await factory.getPair(TOKEN_ADDRESS, WBNB_ADDRESS);

        if (poolAddress === ethers.constants.AddressZero) {
          throw new Error('Пул TOKEN/WBNB не найден!');
        } else {
          console.log('Пул найден', poolAddress)
        }

        const poolUsdtAddress = await factory.getPair(USDT_ADDRESS, WBNB_ADDRESS);
        if (poolUsdtAddress === ethers.constants.AddressZero) {
          throw new Error('Пул USDT/WBNB не найден!');
        } else {
          console.log('Пул найден USDT/WBN', poolUsdtAddress)
        }
        // 3. Цена токена в WBNB
        const priceInWBNB = await getPriceFromPool(
          provider,
          poolAddress,
          TOKEN_ADDRESS,
          WBNB_ADDRESS,
          tokenDecimals,
          18
        );
        console.log('>>> Цена 1:', priceInWBNB)

        // 4. Цена WBNB в USDT
        const wbnbPriceInUSDT = await getPriceFromPool(
          provider,
          poolUsdtAddress,
          WBNB_ADDRESS,
          USDT_ADDRESS,
          18,
          18
        );
        
        // 5. Итоговая цена
        const priceInUSDT = priceInWBNB * wbnbPriceInUSDT;
        priceHolder.innerHTML = priceInUSDT.toFixed(4) + '$'
      } catch (err) {
        console.log('[PriceToken Error]', err)
      }
    }
*/