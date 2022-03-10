"use strict";

const BN = require('bn.js');

const ZERO  = new BN(0);
const ONE   = new BN(1);
const TWO   = new BN(2);
const FOUR  = new BN(4);
const BPS_DIVISOR = new BN(10000);

function bnSqrt(num) {
  if(num.lt(ZERO)) {
    throw new Error("Negtiave input");
  }
  if(num.lt(TWO)) {
    return num;
  }

  const smallCand = bnSqrt(num.shrn(2)).shln(1);
  const largeCand = smallCand.add(ONE);

  return largeCand.mul(largeCand).gt(num) ? smallCand : largeCand;
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
  const e = bnSqrt(b.mul(b).add(d));

  const numerator = e.sub(b);
  const denominator = a.mul(TWO);

  return numerator.div(denominator);
}

/**
 * Calculates optimal swap amount and swap direction
 * 
 * @param  {string|number|BN}       amtA        amount of token A
 * @param  {string|number|BN}       amtB        amount of token B
 * @param  {string|number|BN}       resA        token A reserve in pool
 * @param  {string|number|BN}       resB        token B reserve in pool
 * @param  {string|number|BN}       fee         swap fee in bps
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
 * Calculates swap return
 * 
 * @param  {string|number|BN}       amountIn    amount of input token to swap
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee in bps
 * @return {BN}                                 amount of output token
 */
module.exports.getReturn = function(amountIn, reserveIn, reserveOut, fee) {
  const amtIn = new BN(amountIn);
  const resIn = new BN(reserveIn);
  const resOut = new BN(reserveOut);
  const _fee  = new BN(fee);
  if ( resIn.lte(ZERO) || resOut.lte(ZERO) || amtIn.lte(ZERO)
    || _fee.lt(ZERO) || _fee.gt(BPS_DIVISOR) ) {
      throw new Error("Invalid input");
  }

  const amountWithFee = amtIn.mul(BPS_DIVISOR.sub(_fee));
  return amountWithFee.mul(resOut).div(BPS_DIVISOR.mul(resIn).add(amountWithFee));
}