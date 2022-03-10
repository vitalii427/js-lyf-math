const assert = require('assert').strict;
const BN = require('bn.js');
const {getReturn , optimalDeposit} = require('../');

const O24 = new BN(10).pow(new BN(24));

describe('js-lyf-math', function () {
  describe('.getReturn()', function () {
    it('should throw invalid input error', function () {
      // TODO
    });

    it('correct result', function () {
      const fee = new BN(111);
      const amtA = O24.mul(new BN(20000));
      const resA = O24.mul(new BN(1299997));
      const resB = O24.mul(new BN(1000000000));
      const amtB = getReturn(amtA, resA, resB, fee);
      assert.equal(amtB.toString(),
        '14985887746017313557235134776761');
      const newA = getReturn(amtB, resB.sub(amtB), resA.add(amtA), fee);
      assert.equal(newA.toString(),
        '19565008648014205995055588509');
    });
  });
  describe('.optimalDeposit()', function () {
    it('should throw invalid input error', function () {
      // TODO
    });

    it('correct amount & direction', function () {
      const fee = new BN(111);
      const amtA = O24.mul(new BN(20000));
      const amtB = new BN(0);
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
});