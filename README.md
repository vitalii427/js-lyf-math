# js-lyf-math

JavaScript library containing leverage yield farming helper functions. Depends on https://github.com/indutny/bn.js

### Usage
```js
const {getSwapReturn, getAmountToSwap, optimalDeposit, sqrtBN}  = require('js-lyf-math');
```

### Reference
```js
/**
 * Calculates square root of a number
 *  - throws an error when a number is negative
 * 
 * @param  {string|number|BN}       number      a number
 * @return {BN}                                 square root of the given number
 */
module.exports.sqrtBN = function (number);

/**
 * Calculates how much output token will be returned after swap of the given amount of input token
 * 
 * @param  {string|number|BN}       amountIn    amount of input token to swap
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of output token
 */
module.exports.getSwapReturn = function(amountIn, reserveIn, reserveOut, fee);

/**
 * Calculates how much input token you should swap to get *at least* the given amount of output token
 * 
 * @param  {string|number|BN}       amountOut   amount of output token to get
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of input token
 */
module.exports.getAmountToSwap = function(amountOut, reserveIn, reserveOut, fee);

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
module.exports.optimalDeposit = function(amtA, amtB, resA, resB, fee);
```
