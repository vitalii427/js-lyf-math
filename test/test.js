const assert = require('assert').strict;
const BN = require('bn.js');
const {getSwapReturn, getAmountToSwap, optimalDeposit, sqrtBN}  = require('../');

const O24 = new BN(10).pow(new BN(24));

describe('js-lyf-math', function () {
  describe('.getSwapReturn()', function () {
    it('should throw invalid input error', function () {
      // TODO
    });

    it('correct result', function () {
      const fee = new BN(111);
      const amtA = O24.mul(new BN(20000));
      const resA = O24.mul(new BN(1299997));
      const resB = O24.mul(new BN(1000000000));
      const amtB = getSwapReturn(amtA, resA, resB, fee);
      assert.equal(amtB.toString(),
        '14985887746017313557235134776761');
      const newA = getSwapReturn(amtB, resB.sub(amtB), resA.add(amtA), fee);
      assert.equal(newA.toString(),
        '19565008648014205995055588509');
    });
  });

  describe('.getAmountToSwap()', function () {
    it('should throw invalid input error', function () {
      // TODO
    });

    it('correct result', function () {
      const fee = new BN(111);
      const amtB = O24.mul(new BN(6000));
      const resA = O24.mul(new BN(1299997));
      const resB = O24.mul(new BN(1000000000));
      const amtA = getAmountToSwap(amtB, resA, resB, fee);
      assert.equal(amtA.toString(),
        '7887580948703408875322299');

      // swap(amtA) should return a bit more than amtB needed
      const newB_0 = getSwapReturn(amtA, resA, resB, fee);
      assert.ok(newB_0.gte(amtB));

      // swap(amtA-1) should return a bit less than amtB needed
      const newB_1 = getSwapReturn(amtA.sub(new BN(1)), resA, resB, fee);
      assert.ok(newB_1.lte(amtB));
    });
  });
  describe('.optimalDeposit()', function () {
    it('should throw invalid input error', function () {
      // TODO
    });

    it('correct amount & direction', function () {
      const fee = new BN(111);
      const amtA = O24.mul(new BN(20000));
      const amtB = O24.mul(new BN(0));
      const resA = O24.mul(new BN(1299997));
      const resB = O24.mul(new BN(1000000000));

      const opt1 = optimalDeposit(amtA, amtB, resA, resB, fee);
      const opt2 = optimalDeposit(amtB, amtA, resB, resA, fee);

      assert.equal(opt1.isReversed, false);
      assert.equal(opt1.swapAmount.toString(),
        '10017429330203108534310239605');
      assert.equal(opt2.isReversed, true);
      assert.equal(opt2.swapAmount.toString(),
        '10017429330203108534310239605');
    });
  });

  describe('optimal direct swap (A -> B)', function () {
    it('correct proportion (resA/amtA = resB/amtB)', function () {
      const fee = new BN(111);
      const amtA = O24.mul(new BN(20000));
      const amtB = O24.mul(new BN(6000));
      const resA = O24.mul(new BN(1299997));
      const resB = O24.mul(new BN(1000000000));

      const {swapAmount, isReversed} = optimalDeposit(amtA, amtB, resA, resB, fee);
      assert.equal(isReversed, false);

      // do direct swap (A -> B)
      const swappedB    = getSwapReturn(swapAmount, resA, resB, fee);
      const afterSwapA  = amtA.sub(swapAmount);
      const newResA     = resA.add(swapAmount);
      const afterSwapB  = amtB.add(swappedB);
      const newResB     = resB.sub(swappedB);

      // check proportions
      assert.equal(newResA.div(afterSwapA).toString(), newResB.div(afterSwapB).toString());

      // print calculation error
      const numerator = newResA.mul(afterSwapB).sub(newResB.mul(afterSwapA)).mul(new BN(2)).abs();
      const denominator = newResA.mul(afterSwapB).add(newResB.mul(afterSwapA));
      const invertedError = sqrtBN(denominator.div(numerator));
      console.log(`Сalculation error: 1/${invertedError.toString()} ~ ${1/invertedError.toNumber()}`);
    });
  });

  describe('optimal reversed swap (B -> A)', function () {
    it('correct proportion (resA/amtA = resB/amtB)', function () {
      const fee = new BN(111);
      const amtA = O24.mul(new BN(6000));
      const amtB = O24.mul(new BN(20000));
      const resA = O24.mul(new BN(1000000000));
      const resB = O24.mul(new BN(1299997));

      const {swapAmount, isReversed} = optimalDeposit(amtA, amtB, resA, resB, fee);
      assert.equal(isReversed, true);

      // do reversed swap (B -> A)
      const swappedA    = getSwapReturn(swapAmount, resB, resA, fee);
      const afterSwapA  = amtA.add(swappedA);
      const newResA     = resA.sub(swappedA);
      const afterSwapB  = amtB.sub(swapAmount);
      const newResB     = resB.add(swapAmount);

      // check proportions
      assert.equal(newResA.div(afterSwapA).toString(), newResB.div(afterSwapB).toString());

      // print calculation error
      const numerator = newResA.mul(afterSwapB).sub(newResB.mul(afterSwapA)).mul(new BN(2)).abs();
      const denominator = newResA.mul(afterSwapB).add(newResB.mul(afterSwapA));
      const invertedError = sqrtBN(denominator.div(numerator));
      console.log(`Сalculation error: 1/${invertedError.toString()} ~ ${1/invertedError.toNumber()}`);
    });
  });
});