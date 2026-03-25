import type { AppProps } from "next/app"
import Head from 'next/head'
import getConfig from 'next/config'

import { useEffect, useState } from "react"
import AppRootWrapper from '@/components/AppRootWrapper'
import NETWORKS from '@/contstans/NETWORKS'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { fromWei } from '@/helpers/wei'
import { TITLE } from '@/config'
import LoadingIndicator from '@/components/LoadingIndicator'
import { getDateTimeFromBlock } from '@/helpers/getDateTimeFromBlock'
import BigNumber from "bignumber.js"


function GGWDashboardView(pageProps) {
  const {
    chainId,
    tokenAddress,
    tokenInfo,
    tokenInfoFetching,
    tokenInfoFetched,
    
    tokenPrice,
    tokenPriceFetched,
    
    depositsInfo,
    depositsInfoFetched,

    depGamesBank,
    lotoGameBank_1,
    lotoGameBank_2,
    lotoGameBank_3,
  } = useDashboardContext()
  return (
    <>
      <div className="text-slate-300 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
        {/*<!-- Header -->*/}
        <header className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold text-white tracking-tight">GGC Dashboard</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                LIVE
              </span>
            </div>
            <p className="text-slate-400">Real-time ecosystem analytics & configuration</p>
          </div>
          <div className="text-right text-sm text-slate-500 mono">
            <div className="flex items-center gap-2 justify-end mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {(depositsInfo && depositsInfoFetched) ? (
                <>{`Last Updated: ${getDateTimeFromBlock(depositsInfo.blockTimeStamp)}`}</>
              ) : (
                <LoadingIndicator text={`Last Updated: ..-..-.... ..:..:..`} circle={false} color={``} />
              )}
            </div>
            
            <div>
              {(depositsInfo && depositsInfoFetched) ? (
                <>{`Block: #${depositsInfo.blockNumber}`}</>
              ) : (
                <LoadingIndicator text={`Block: #..........`} circle={false} color={``} />
              )}
            </div>
          </div>
        </header>

        {/*<!-- Game Statistics -->*/}
        <section>
          <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Game Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/*<!-- Total Games -->*/}
            <div className="gradient-border rounded-xl p-5 card-hover bg-slate-900/50 backdrop-blur">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Games</span>
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">14,215</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    +124 since reset
                </div>
            </div>

            {/*<!-- Active Players -->*/}
            <div className="gradient-border rounded-xl p-5 card-hover bg-slate-900/50 backdrop-blur">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {`Active Players`}
                </span>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {(depositsInfo && depositsInfoFetched) ? (
                  <>{depositsInfo.usersCount}</>
                ) : (
                  <LoadingIndicator text={`...`} circle={false} color={``} />
                )}
              </div>
                {/*<div className="text-xs text-slate-500">Online Now</div>*/}
            </div>

            {/*<!-- Total Volume -->*/}
            <div className="gradient-border rounded-xl p-5 card-hover bg-slate-900/50 backdrop-blur">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {`Total Volume`}
                </span>
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {(depositsInfo && tokenInfo && depositsInfoFetched && tokenInfoFetched) ? (
                  <>{fromWei(depositsInfo.totalDepositAmount, tokenInfo.decimals)}</>
                ) : (
                  <LoadingIndicator text={`.......`} circle={false} color={``} />
                )}
                {` `}
                <span className="text-lg text-slate-400 font-normal">
                  {(tokenInfo && tokenInfoFetched) ? (
                    <>{tokenInfo.symbol}</>
                  ) : (
                    <LoadingIndicator text={`...`} circle={false} color={``} />
                  )}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {(
                  tokenPrice
                  && tokenInfo 
                  && depositsInfo 
                  && tokenPriceFetched
                  && tokenInfoFetched
                  && depositsInfoFetched
                ) ? (
                  <>
                    {`$`}
                    {
                      new BigNumber(
                        fromWei(depositsInfo.totalDepositAmount, tokenInfo.decimals)
                      ).multipliedBy(tokenPrice).toFixed(2)
                    }
                  </>
                ) : (
                  <LoadingIndicator text={`≈ $......`} circle={false} color={``} />
                )}
                {/*≈ $101,767.32*/}
              </div>
            </div>

            {/*<!-- Win Rate -->*/}
            <div className="gradient-border rounded-xl p-5 card-hover bg-slate-900/50 backdrop-blur">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Win Rate</span>
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">48.5%</div>
              <div className="text-xs text-slate-500">Global Average</div>
            </div>
          </div>
        </section>

        {/*<!-- Tokenomics & Pools -->*/}
        <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white uppercase tracking-wide">
                {`Tokenomics & Pools`}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/*<!-- Total Staked -->*/}
                <div className="gradient-border rounded-xl p-6 card-hover bg-gradient-to-br from-purple-900/20 to-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-300">Total Staked GGC</div>
                            <div className="text-3xl font-bold text-white">1,250,400 <span className="text-lg text-slate-400 font-normal">GGC</span></div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Pool Load</span>
                            <span className="text-purple-400 font-medium">62%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-[62%] bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>$150,048 USD Value</span>
                            <span>Target: 2M GGC</span>
                        </div>
                    </div>
                </div>

                {/*<!-- Burn Pool -->*/}
                <div className="gradient-border rounded-xl p-6 card-hover bg-gradient-to-br from-orange-900/20 to-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-300">Burn Pool</div>
                            <div className="text-3xl font-bold text-white">452,530 <span className="text-lg text-slate-400 font-normal">GGC</span></div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Pool Load</span>
                            <span className="text-orange-400 font-medium">4.5%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-[4.5%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Deflationary Impact</span>
                            <span>Total Supply Burned</span>
                        </div>
                    </div>
                </div>

                {/*<!-- Game Treasury -->*/}
                <div className="gradient-border rounded-xl p-6 card-hover bg-gradient-to-br from-blue-900/20 to-slate-900/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300">
                        {`Game Treasury (Bank)`}
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {(tokenInfo && tokenInfoFetched) ? (
                          <>
                            {
                              fromWei(
                                new BigNumber(
                                  depGamesBank
                                ).plus(
                                  lotoGameBank_1
                                ).plus(
                                  lotoGameBank_2
                                ).plus(
                                  lotoGameBank_3
                                ).toFixed(),
                                tokenInfo.decimals
                              )
                            }
                          </>
                        ) : (
                          <LoadingIndicator text={`...`} circle={false} color={``} />
                        )}
                        {` `}
                        <span className="text-lg text-slate-400 font-normal">
                          {(tokenInfo && tokenInfoFetched) ? (
                            <>{tokenInfo.symbol}</>
                          ) : (
                            <LoadingIndicator text={`...`} circle={false} color={``} />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Pool Load</span>
                      <span className="text-blue-400 font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Solvency Ratio: 150%</span>
                      <span>Max Risk Cap</span>
                    </div>
                  </div>
                </div>
            </div>

            {/*<!-- Token Info Bars -->*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-400">
                  {`GGC Token Price`}
                </span>
                <span className="text-xl font-bold text-white mono">
                  {(tokenPrice && tokenPriceFetched) ? (
                    <>{`$${tokenPrice.toFixed(4)}`}</>
                  ) : (
                    <LoadingIndicator text={`...`} circle={false} color={`font-bold text-white mono`} />
                  )}
                  {` `}
                  <span className="text-sm text-slate-500">
                    {(tokenPrice && tokenPriceFetched) ? (
                      <>{`USD`}</>
                    ) : (
                      <LoadingIndicator text={`USD`} circle={false} color={`text-sm text-slate-500`} />
                    )}
                  </span>
                </span>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-400">
                  {`Circulating Supply`}
                </span>
                <span className="text-xl font-bold text-white mono">
                  {(tokenInfo && tokenInfoFetched) ? (
                    <>{fromWei(tokenInfo.totalSupply, tokenInfo.decimals)}</>
                  ) : (
                    <LoadingIndicator text={`...`} circle={false} color={`font-bold text-white mono`} />
                  )}
                  {` `}
                  <span className="text-sm text-slate-500">
                    {(tokenInfo && tokenInfoFetched) ? (
                      <>{tokenInfo.symbol}</>
                    ) : (
                      <LoadingIndicator text={`...`} circle={false} color={`text-sm text-slate-500`} />
                    )}
                  </span>
                </span>
              </div>
            </div>
        </section>

        {/*<!-- System Configuration -->*/}
        <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-white uppercase tracking-wide">System Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/*<!-- Smart Contracts -->*/}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Smart Contracts</h3>
                    
                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-slate-300">Owner Wallet</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <code className="text-xs mono text-slate-400 bg-slate-800 px-2 py-1 rounded">0x71C7...976F</code>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-slate-300">Staking Contract</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <code className="text-xs mono text-slate-400 bg-slate-800 px-2 py-1 rounded">0x250b...1f22</code>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-slate-300">Burn Address</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <code className="text-xs mono text-slate-400 bg-slate-800 px-2 py-1 rounded">0x0000...dead</code>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/*<!-- Settings & Gas -->*/}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Settings & Gas</h3>
                    
                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                            <span className="text-slate-300">Gas Fee Payer</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <code className="text-xs mono text-slate-400 bg-slate-800 px-2 py-1 rounded">0x8920...43e7</code>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-slate-300">Min Withdraw</span>
                        </div>
                        <span className="text-white mono font-medium">500.00 <span className="text-slate-500 text-sm">GGC</span></span>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-slate-300">Platform Fee</span>
                        </div>
                        <span className="text-white mono font-medium">2.5%</span>
                    </div>
                </div>
            </div>
        </section>

        {/*<!-- Footer -->*/}
        <footer className="text-center text-sm text-slate-600 pt-8 pb-4">
            <p>Data verified via Chainlink Oracles • <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">View Audit Report</a></p>
        </footer>
      </div>
    </div>
    </>
  )
}

export default GGWDashboardView;
