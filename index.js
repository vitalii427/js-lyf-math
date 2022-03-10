import {BN} from 'bn.js';

const FEE_DIVISOR = new BN(10000);
const ZERO = new BN(0);
const ONE = new BN(1);
const TWO = new BN(2);
const THREE = new BN(3);
const FOUR = new BN(4);

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

function _optimalDepositA(amtA, amtB, resA, resB, fee) {
  if (amtA.mul(resB).lt(amtB.mul(resA))) {
    throw new Error("Reversed");
  }

  let a = FEE_DIVISOR.sub(fee);
  let b = FEE_DIVISOR.mul(TWO).sub(fee).mul(resA);
  let _c = amtA.mul(resB).sub(amtB.mul(resA));
  let c = _c.mul(FEE_DIVISOR).div(amtB.add(resB)).mul(resA);

  let d = a.mul(c).mul(FOUR);
  let e = bnSqrt(b.mul(b).add(d));

  let numerator = e.sub(b);
  let denominator = a.mul(TWO);

  return numerator.div(denominator);
}

function optimalDeposit(amtA, amtB, resA, resB, fee) {
  let swapAmt;
  let isReversed;
  if (amtA.mul(resB).gte(amtB.mul(resA))) {
    swapAmt = _optimalDepositA(amtA, amtB, resA, resB, fee);
    isReversed = false;
  } else {
    swapAmt = _optimalDepositA(amtB, amtA, resB, resA, fee);
    isReversed = true;
  }
  return [swapAmt, isReversed];
}

function getReturn(amountIn, reserveIn, reserveOut, fee) {
  let amountWithFee = amountIn.mul(FEE_DIVISOR.sub(fee));
  return amountWithFee.mul(reserveOut).div(FEE_DIVISOR.mul(reserveIn).add(amountWithFee));
}

function test() {

  const O24 = new BN(10).pow(new BN(24));

  const fee = new BN(100);
  const amtA  = O24.mul(new BN(20000));
  const amtB  = new BN(0);
  const resA  = O24.mul(new BN(1299997));
  const resB  = O24.mul(new BN(1000000000));

  const [swapAmt, isReversed] = optimalDeposit(amtA, amtB, resA, resB, fee);

  const swappedB = getReturn(swapAmt, resA, resB, fee);
  const leftA = amtA.sub(swapAmt);
  const newA = resA.add(swapAmt);
  const newB = resB.sub(swappedB);
  const swappedA = getReturn(swappedB, newB, newA, fee);
  const balancedA = leftA.mul(newB).div(O24);
  const balancedB = swappedB.mul(newA).div(O24);
  console.log('new', newA.toString(), newB.toString());
  console.log('swapAmt ', swapAmt.toString(), swappedB.toString());
  console.log('swappedA', swappedA.toString(), swapAmt.sub(swappedA).toString(), swapAmt.sub(swappedA).div(O24).toString());
  console.log(balancedA.toString(), balancedB.toString(), balancedA.sub(balancedB).toString());
}

test();