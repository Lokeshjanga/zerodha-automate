import { getKiteClient } from "./client.js";
import { normalizeError } from "../errors.js";

export type OrderInput = {
  tradingsymbol: string;
  quantity: number;
  transaction_type: "BUY" | "SELL";
  exchange?: "NSE" | "BSE";
  product?: "CNC" | "MIS" | "NRML";
  order_type?: "MARKET" | "LIMIT";
  validity?: "DAY" | "IOC";
};

export async function placeOrder(input: OrderInput) {
  try {
    const client = getKiteClient();
    const response = await client.placeOrder("regular", {
      exchange: input.exchange || "NSE",
      tradingsymbol: input.tradingsymbol,
      transaction_type: input.transaction_type,
      quantity: input.quantity,
      product: input.product || "CNC",
      order_type: input.order_type || "MARKET",
      validity: input.validity || "DAY",
    });
    return response;
  } catch (error) {
    throw new Error(`Order placement failed: ${normalizeError(error)}`);
  }
}

export async function getHoldings() {
  try {
    const client = getKiteClient();
    const response = await client.getHoldings();
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch holdings: ${normalizeError(error)}`);
  }
}

export async function getFunds() {
  try {
    const client = getKiteClient();
    const response = await client.getMargins();
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch funds: ${normalizeError(error)}`);
  }
}
