import { placeOrder, getHoldings, getFunds } from "../kite/trading.js";
import { formatHoldings, formatFunds } from "../formatters.js";
import { normalizeError } from "../errors.js";

export const toolsDefinition = [
  {
    name: "buy_stock",
    description: "Place a Zerodha BUY order for an NSE equity.",
    inputSchema: {
      type: "object" as const,
      properties: {
        symbol: { type: "string", description: "Trading symbol (e.g. INFy)" },
        quantity: { type: "integer", minimum: 1, description: "Quantity to buy" },
        confirm: { type: "boolean", description: "Set to true to confirm execution, otherwise a dry run is performed." },
        exchange: { type: "string", enum: ["NSE", "BSE"], default: "NSE" },
        product: { type: "string", enum: ["CNC", "MIS", "NRML"], default: "CNC" },
        order_type: { type: "string", enum: ["MARKET", "LIMIT"], default: "MARKET" }
      },
      required: ["symbol", "quantity"]
    }
  },
  {
    name: "sell_stock",
    description: "Place a Zerodha SELL order for an NSE equity.",
    inputSchema: {
      type: "object" as const,
      properties: {
        symbol: { type: "string", description: "Trading symbol (e.g. INFY)" },
        quantity: { type: "integer", minimum: 1, description: "Quantity to sell" },
        confirm: { type: "boolean", description: "Set to true to confirm execution, otherwise a dry run is performed." },
        exchange: { type: "string", enum: ["NSE", "BSE"], default: "NSE" },
        product: { type: "string", enum: ["CNC", "MIS", "NRML"], default: "CNC" },
        order_type: { type: "string", enum: ["MARKET", "LIMIT"], default: "MARKET" }
      },
      required: ["symbol", "quantity"]
    }
  },
  {
    name: "show_portfolio",
    description: "Return current Zerodha holdings.",
    inputSchema: {
      type: "object" as const,
      properties: {}
    }
  },
  {
    name: "get_funds",
    description: "Return available funds/margins.",
    inputSchema: {
      type: "object" as const,
      properties: {}
    }
  }
];

export async function handleToolCall(name: string, args: any) {
  try {
    switch (name) {
      case "buy_stock": {
        const { symbol, quantity, confirm, exchange, product, order_type } = args;
        const details = `BUY ${quantity} ${symbol} on ${exchange || "NSE"} (${product || "CNC"}, ${order_type || "MARKET"})`;
        if (!confirm) {
          return { content: [{ type: "text", text: `Dry run for ${details}. Provide confirm: true to execute.` }] };
        }
        const res = await placeOrder({
          tradingsymbol: symbol,
          quantity,
          transaction_type: "BUY",
          exchange,
          product,
          order_type,
        });
        return { content: [{ type: "text", text: `Successfully placed BUY order: ${JSON.stringify(res)}` }] };
      }
      case "sell_stock": {
        const { symbol, quantity, confirm, exchange, product, order_type } = args;
        const details = `SELL ${quantity} ${symbol} on ${exchange || "NSE"} (${product || "CNC"}, ${order_type || "MARKET"})`;
        if (!confirm) {
          return { content: [{ type: "text", text: `Dry run for ${details}. Provide confirm: true to execute.` }] };
        }
        const res = await placeOrder({
          tradingsymbol: symbol,
          quantity,
          transaction_type: "SELL",
          exchange,
          product,
          order_type,
        });
        return { content: [{ type: "text", text: `Successfully placed SELL order: ${JSON.stringify(res)}` }] };
      }
      case "show_portfolio": {
        const holdings = await getHoldings();
        return { content: [{ type: "text", text: formatHoldings(holdings) }] };
      }
      case "get_funds": {
        const funds = await getFunds();
        return { content: [{ type: "text", text: formatFunds(funds) }] };
      }
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (error) {
    return { content: [{ type: "text", text: `Error executing ${name}: ${normalizeError(error)}` }], isError: true };
  }
}
