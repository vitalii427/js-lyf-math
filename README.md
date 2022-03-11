# js-lyf-math

JavaScript library containing leverage yield farming helper functions. Depends on https://github.com/indutny/bn.js

### Usage
```js
const {
  getSwapReturn,
  getAmountToSwap,
  getPositionValue,
  optimalDeposit,
  sharesToValue,
  valueToShares,
  sqrtBN
} = require('js-lyf-math');
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
 * Calculates a value that matches to the given number of shares
 * 
 * @param  {string|number|BN}       shares      number of shares
 * @param  {string|number|BN}       totalShares total number of shares
 * @param  {string|number|BN}       totalValue  total value
 * @return {BN}                                 value
 */
module.exports.sharesToValue = function(shares, totalShares, totalValue);

/**
 * Calculates a number of shares that match to the given value
 * 
 * @param  {string|number|BN}       value       a value
 * @param  {string|number|BN}       totalShares total shares amount
 * @param  {string|number|BN}       totalValue  total value
 * @return {BN}                                 number of shares
 */
module.exports.valueToShares = function(value, totalShares, totalValue);

/**
 * Calculates an amount output token will be returned after swap of the given amount of input token
 * 
 * @param  {string|number|BN}       amountIn    amount of input token to swap
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of output token
 */
module.exports.getSwapReturn = function(amountIn, reserveIn, reserveOut, fee);

/**
 * Calculates an amount of input token you should swap to get *at least* the given amount of output token
 * 
 * @param  {string|number|BN}       amountOut   amount of output token to get
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of input token
 */
module.exports.getAmountToSwap = function(amountOut, reserveIn, reserveOut, fee);

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
module.exports.getPositionValue = function(amountBase, amountFarm, reserveBase, reserveFarm, fee);

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
