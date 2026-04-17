export function formatHoldings(holdings: any[]): string {
  if (!holdings || holdings.length === 0) {
    return "No holdings found in portfolio.";
  }

  return holdings.map((h: any) => {
    return `Symbol: ${h.tradingsymbol} | Qty: ${h.quantity} | Avg Price: ${h.average_price} | LTP: ${h.last_price} | P&L: ${h.pnl}`;
  }).join("\n");
}

export function formatFunds(margins: any): string {
  if (!margins || !margins.equity) {
    return "Margin information unavailable.";
  }
  const eq = margins.equity;
  return `Available Cash: ${eq.available?.cash ?? 0}\nUsed Margin: ${eq.utilised?.debits ?? 0}\nNet Available: ${eq.net ?? 0}`;
}
