import { expect, test, describe, beforeEach, vi } from "vitest";

// Mock the config before importing anything else depending on it
vi.mock("../src/config.js", () => {
  return {
    config: {
      KITE_API_KEY: "dummy_key",
      KITE_ACCESS_TOKEN: "dummy_token"
    }
  };
});

import { handleToolCall } from "../src/mcp/tools.js";
import { setKiteClient } from "../src/kite/client.js";
import { formatHoldings, formatFunds } from "../src/formatters.js";

// Dummy kite client for testing
class DummyKiteClient {
  public lastOrderParams: any = null;

  async placeOrder(variety: string, params: any) {
    this.lastOrderParams = params;
    return { order_id: "12345" };
  }

  async getHoldings() {
    return [
      { tradingsymbol: "INFY", quantity: 10, average_price: 1500, last_price: 1550, pnl: 500 }
    ];
  }

  async getMargins() {
    return {
      equity: {
        available: { cash: 10000 },
        utilised: { debits: 2000 },
        net: 8000
      }
    };
  }
}

describe("MCP Tools", () => {
  let dummyClient: DummyKiteClient;

  beforeEach(() => {
    dummyClient = new DummyKiteClient();
    setKiteClient(dummyClient as any);
  });

  test("buy_stock requires confirmation", async () => {
    const args = { symbol: "INFY", quantity: 10, confirm: false };
    const result = await handleToolCall("buy_stock", args);
    expect((result as any).content[0].text).toContain("Dry run");
    expect(dummyClient.lastOrderParams).toBeNull();
  });

  test("buy_stock executes when confirmed", async () => {
    const args = { symbol: "INFY", quantity: 10, confirm: true };
    const result = await handleToolCall("buy_stock", args);
    expect((result as any).content[0].text).toContain("Successfully placed BUY order");
    expect(dummyClient.lastOrderParams).toEqual({
      exchange: "NSE",
      tradingsymbol: "INFY",
      transaction_type: "BUY",
      quantity: 10,
      product: "CNC",
      order_type: "MARKET",
      validity: "DAY"
    });
  });

  test("sell_stock executes when confirmed with SELL type", async () => {
    const args = { symbol: "TCS", quantity: 5, confirm: true };
    const result = await handleToolCall("sell_stock", args);
    expect((result as any).content[0].text).toContain("Successfully placed SELL order");
    expect(dummyClient.lastOrderParams).toEqual({
      exchange: "NSE",
      tradingsymbol: "TCS",
      transaction_type: "SELL",
      quantity: 5,
      product: "CNC",
      order_type: "MARKET",
      validity: "DAY"
    });
  });

  test("show_portfolio formats correctly", async () => {
    const result = await handleToolCall("show_portfolio", {});
    expect((result as any).content[0].text).toContain("Symbol: INFY | Qty: 10");
  });

  test("get_funds formats correctly", async () => {
    const result = await handleToolCall("get_funds", {});
    expect((result as any).content[0].text).toContain("Available Cash: 10000");
    expect((result as any).content[0].text).toContain("Net Available: 8000");
  });
});

describe("Formatters Edge Cases", () => {
  test("formatHoldings handles empty array", () => {
    expect(formatHoldings([])).toBe("No holdings found in portfolio.");
  });

  test("formatHoldings handles null", () => {
    expect(formatHoldings(null as any)).toBe("No holdings found in portfolio.");
  });

  test("formatFunds handles missing margin fields", () => {
    expect(formatFunds({})).toBe("Margin information unavailable.");
  });

  test("formatFunds handles missing sub-fields", () => {
    expect(formatFunds({ equity: {} })).toBe("Available Cash: 0\nUsed Margin: 0\nNet Available: 0");
  });
});
