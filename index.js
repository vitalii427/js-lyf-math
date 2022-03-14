"use strict";

const BN = require('bn.js');

const ZERO  = new BN(0);
const ONE   = new BN(1);
const TWO   = new BN(2);
const FOUR  = new BN(4);
const BPS_DIVISOR = new BN(10000);

/**
 * Calculates square root of a number
 *  - throws an error when a number is negative
 * 
 * @param  {string|number|BN}       number      a number
 * @return {BN}                                 square root of the given number
 */
const sqrtBN = module.exports.sqrtBN = function(number) {
  if(number.lt(ZERO)) {
    throw new Error("Negtiave input");
  }
  if(number.lt(TWO)) {
    return number;
  }

  const smallCand = sqrtBN(number.shrn(2)).shln(1);
  const largeCand = smallCand.add(ONE);

  return largeCand.mul(largeCand).gt(number) ? smallCand : largeCand;
}

function _optimalDeposit(amtA, amtB, resA, resB, fee) {
  if (amtA.mul(resB).lt(amtB.mul(resA))) {
    throw new Error("Reversed");
  }

  const a = BPS_DIVISOR.sub(fee);
  const b = BPS_DIVISOR.mul(TWO).sub(fee).mul(resA);
  const _c = amtA.mul(resB).sub(amtB.mul(resA));
  const c = _c.mul(BPS_DIVISOR).div(amtB.add(resB)).mul(resA);
  const d = a.mul(c).mul(FOUR);
  const e = sqrtBN(b.mul(b).add(d));

  const numerator = e.sub(b);
  const denominator = a.mul(TWO);

  return numerator.div(denominator);
}

/**
 * Calculates optimal swap amount and swap direction
 *  - isReversed is true when amtA * resB < amtB * resA
 *  - when isReversed is false you should swap swapAmount of token A for token B
 *  - when isReversed is true  you should swap swapAmount of token B for token A
 * 
 * @param  {string|number|BN}       amtA        amount of token A
 * @param  {string|number|BN}       amtB        amount of token B
 * @param  {string|number|BN}       resA        token A reserve in pool
 * @param  {string|number|BN}       resB        token B reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {{swapAmount: BN, isReversed: bool}}
 *         amount to swap & reversed swap direction flag (B -> A)
 */
module.exports.optimalDeposit = function(amtA, amtB, resA, resB, fee) {
  const _amtA = new BN(amtA);
  const _amtB = new BN(amtB);
  const _resA = new BN(resA);
  const _resB = new BN(resB);
  const _fee  = new BN(fee);
  if ( _amtA.lt(ZERO) || _amtB.lt(ZERO)
  || _resA.lte(ZERO) || _resB.lte(ZERO)
  || _fee.lt(ZERO) || _fee.gt(BPS_DIVISOR) ) {
    throw new Error("Invalid input");
  }
  const isReversed = _amtA.mul(_resB).lt(_amtB.mul(_resA));
  const swapAmount = isReversed
    ? _optimalDeposit(_amtB, _amtA, _resB, _resA, _fee)
    : _optimalDeposit(_amtA, _amtB, _resA, _resB, _fee);
  return {swapAmount, isReversed};
}

/**
 * Calculates an amount output token will be returned after swap of the given amount of input token
 * 
 * @param  {string|number|BN}       amountIn    amount of input token to swap
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of output token
 */
const getSwapReturn = module.exports.getSwapReturn = function(amountIn, reserveIn, reserveOut, fee) {
  const amtIn  = new BN(amountIn);
  const resIn  = new BN(reserveIn);
  const resOut = new BN(reserveOut);
  const _fee   = new BN(fee);
  if ( resIn.lte(ZERO) || resOut.lte(ZERO) || amtIn.lte(ZERO)
  || _fee.lt(ZERO) || _fee.gt(BPS_DIVISOR) ) {
    throw new Error("Invalid input");
  }

  const amountWithFee = amtIn.mul(BPS_DIVISOR.sub(_fee));
  return amountWithFee.mul(resOut).div(BPS_DIVISOR.mul(resIn).add(amountWithFee));
}

/**
 * Calculates an amount of input token you should swap to get *at least* the given amount of output token
 * 
 * @param  {string|number|BN}       amountOut   amount of output token to get
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of input token
 */
module.exports.getAmountToSwap = function(amountOut, reserveIn, reserveOut, fee) {
  const amtOut = new BN(amountOut);
  const resIn  = new BN(reserveIn);
  const resOut = new BN(reserveOut);
  const _fee   = new BN(fee);
  if ( resIn.lte(ZERO) || resOut.lte(ZERO) || amtOut.lte(ZERO)
  || _fee.lt(ZERO) || _fee.gt(BPS_DIVISOR) ) {
    throw new Error("Invalid input");
  }

  const amountWithFee = amtOut.mul(BPS_DIVISOR).mul(resIn).div(resOut.sub(amtOut));
  return amountWithFee.div(BPS_DIVISOR.sub(_fee)).add(ONE);
}

/**
 * Calculates a value that matches to the given number of shares
 * 
 * @param  {string|number|BN}       shares      number of shares
 * @param  {string|number|BN}       totalShares total number of shares
 * @param  {string|number|BN}       totalValue  total value
 * @return {BN}                                 value
 */
module.exports.sharesToValue = function(shares, totalShares, totalValue) {
  shares      = new BN(shares);
  totalShares = new BN(totalShares);
  totalValue  = new BN(totalValue);
  if ( shares.lte(ZERO) || totalShares.lt(ZERO) || totalValue.lt(ZERO) ) {
    throw new Error("Invalid input");
  }
  if (totalShares.eq(ZERO)) {
    return shares; // When there's no shares, 1 share = 1 value
  }
  return shares.mul(totalValue).div(totalShares);
}

/**
 * Calculates a number of shares that match to the given value
 * 
 * @param  {string|number|BN}       value       a value
 * @param  {string|number|BN}       totalShares total shares amount
 * @param  {string|number|BN}       totalValue  total value
 * @return {BN}                                 number of shares
 */
module.exports.valueToShares = function(value, totalShares, totalValue) {
  value       = new BN(value);
  totalShares = new BN(totalShares);
  totalValue  = new BN(totalValue);
  if ( value.lte(ZERO) || totalShares.lt(ZERO) || totalValue.lt(ZERO) ) {
    throw new Error("Invalid input");
  }
  if (totalShares.eq(ZERO)) {
    return value; // When there's no shares, 1 share = 1 value
  }
  return value.mul(totalShares).div(totalValue);
}

/**
 * Calculates position value which equals an amount of base token after position liquidation
 *
 * @param  {string|number|BN}       amountBase  amount of base token (debt token)
 * @param  {string|number|BN}       amountFarm  amount of farm token
 * @param  {string|number|BN}       reserveBase base token reserve in pool
 * @param  {string|number|BN}       reserveFarm farm token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of base token
 */
module.exports.getPositionValue = function(amountBase, amountFarm, reserveBase, reserveFarm, fee) {
  amountBase = new BN(amountBase);
  amountFarm = new BN(amountFarm);
  reserveBase = new BN(reserveBase);
  reserveFarm = new BN(reserveFarm);
  fee = new BN(fee);
  if ( amountBase.lte(ZERO) || amountFarm.lte(ZERO)
  || reserveBase.lte(ZERO) || reserveFarm.lte(ZERO)
  || fee.lt(ZERO) || fee.gt(BPS_DIVISOR) ) {
    throw new Error("Invalid input");
  }
  return amountBase.add(getSwapReturn(amountFarm, reserveFarm.sub(amountFarm), reserveBase.sub(amountBase), fee));
}

