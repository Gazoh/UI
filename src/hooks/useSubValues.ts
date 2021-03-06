import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import {BigNumber} from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getWethPrice, getBaoPrice, getWethPriceContract, getBaoPriceContract } from '../sushi/utils'
import useLockedEarnings from './useLockedEarnings'
import useSushi from './useSushi'
import useBlock from './useBlock'



const useSubValues = () => {
   const { account }: { account: string } = useWallet()
   const sushi = useSushi()
   //const wethPriceContract = getWethPriceContract(sushi)
   //const baoPriceContract = getBaoPriceContract(sushi)
   const locks = useLockedEarnings()
   const [usrSubText, setUsrSubText] = useState(new String())
   const [baoPrices, setBaoPrices] = useState(new BigNumber(0))
   const [wethPrices, setWethPrices] = useState(new BigNumber(0))
	
const getInfo = useCallback(async () => {
	if(sushi){
   let wethPriceFun = getWethPrice(sushi).then((response) => {
	setWethPrices(response);
	
	let baoPriceFun = getBaoPrice(sushi).then((response) => {
	   setBaoPrices(response);
  var currentRate = wethPrices.dividedBy(100000000).dividedBy(baoPrices)
  var userValue = currentRate.multipliedBy(locks.dividedBy(1000000000000000000))
  var dailyPrice = userValue.dividedBy(1095).toFormat(2)
  console.log(dailyPrice + " dailyPrice");
  console.log(wethPrices + " wethprice");
  console.log(baoPrices + " baoPrice");
  var annualPrice = userValue.dividedBy(3).toFormat(2)
  console.log(annualPrice + " annual");
  var wethText = userValue.toFormat(2)
  var usrSubText =  "When this unlocks it will earn you $"+dailyPrice+" per day for 3 years. The equivelent of $"+annualPrice+ " per year!";
  setUsrSubText(usrSubText);
   })
})}}, [locks, usrSubText]);


	useEffect(() => {
	 if(account && sushi) {
		getInfo()
		}
	}, [account, sushi, locks, usrSubText])
	
return usrSubText.toString();
}

export default useSubValues
