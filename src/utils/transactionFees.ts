

interface FeeConfig {
  type: "percentage" | "flat";
  value: number;
}

const TRANSACTION_FEES: { [key: string]: FeeConfig } = {
  send: { type: "percentage", value: 0.01 }, 
  "cash-out": { type: "flat", value: 10 }, 
};

export const calculateTransactionFee = (
  transactionType: string,
  amount: number
): {
  fee: number;
  feeType: "percentage" | "flat" | undefined;
  feeValue: number | undefined;
} => {
  const config = TRANSACTION_FEES[transactionType];

  if (!config) {
    return { fee: 0, feeType: undefined, feeValue: undefined };
  }

  let fee = 0;
  if (config.type === "percentage") {
    fee = amount * config.value;
  } else if (config.type === "flat") {
    fee = config.value;
  }

  return { fee, feeType: config.type, feeValue: config.value };
};
