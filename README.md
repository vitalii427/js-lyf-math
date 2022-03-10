# js-lyf-math

```js
/**
 * Calculates swap return
 * 
 * @param  {string|number|BN}       amountIn    amount of input token to swap
 * @param  {string|number|BN}       reserveIn   input token reserve in pool
 * @param  {string|number|BN}       reserveOut  output token reserve in pool
 * @param  {string|number|BN}       fee         swap fee value in bps (10000 = 100%)
 * @return {BN}                                 amount of output token
 */
module.exports.getReturn = function(amountIn, reserveIn, reserveOut, fee);

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