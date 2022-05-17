export function getSwapReturn(
  amountIn: string | number | BN,
  reserveIn: string | number | BN,
  reserveOut: string | number | BN,
  fee: string | number | BN
);

export function getAmountToSwap(
  amountOut: string | number | BN,
  reserveIn: string | number | BN,
  reserveOut: string | number | BN,
  fee: string | number | BN
);

export function getPositionValue(
  amountBase: string | number | BN,
  amountFarm: string | number | BN,
  reserveBase: string | number | BN,
  reserveFarm: string | number | BN,
  fee: string | number | BN
);

export function optimalDeposit(
  amtA: string | number | BN,
  amtB: string | number | BN,
  resA: string | number | BN,
  resB: string | number | BN,
  fee: string | number | BN
);

export function sharesToValue(
  shares: string | number | BN,
  totalShares: string | number | BN,
  totalValue: string | number | BN
);

export function valueToShares(
  shares: string | number | BN,
  totalShares: string | number | BN,
  totalValue: string | number | BN
);

export function sqrtBN(number: string | number | BN);
