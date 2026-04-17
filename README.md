# Zerodha Trade MCP Server

A production-quality local Model Context Protocol (MCP) server for interacting with Zerodha Kite Connect.
This server provides tools to an AI assistant or MCP client to view your account information and place live orders securely.

## Features
- **Secure by Default:** No hard-coded secrets. Uses environment variables or `.env`.
- **Validation First:** Validates API inputs explicitly, requiring confirmation logic to execute orders.
- **Account Data:** Exposes real-time portfolio holdings and available funds/margins.

## Prerequisites
- Node.js 20+
- A valid Zerodha Kite Connect developer account

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Configuration:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   **Required variables:**
   - `KITE_API_KEY`
   - `KITE_API_SECRET` OR `KITE_ACCESS_TOKEN`

## Generating a Kite Access Token

If you do not want the server to manage web-based login flows, you can generate an access token manually:
1. Log into your Kite developer console, map your API key.
2. Hit the login URL for your API key.
3. Upon redirect, copy the `request_token` from the URL.
4. Exchange the `request_token` for an `access_token` and save it to `KITE_ACCESS_TOKEN` in your `.env`.

Alternatively, use a side-script to authenticate and keep the token fresh. Note: the MCP server accesses the `.env` on startup; restarting it is necessary if the `.env` file changes.

## Running the Server

Start up the MCP stdio server:
```bash
npm run dev
```

During normal operation, the server communicates with the client via standard input/output. All logs or text are written to standard error `stderr` to prevent corrupting the protocol messages.

## MCP Client Configuration

Example for configuring in a client supporting MCP:
```json
{
  "mcpServers": {
    "zerodha-mcp": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "env": {
        "KITE_API_KEY": "YOUR_API_KEY",
        "KITE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN"
      }
    }
  }
}
```

## Available Tools

- `show_portfolio`: Returns current equity holdings.
- `get_funds`: Returns available funds and margins.
- `buy_stock`: Places a BUY order for an NSE equity. Requires `confirm: true` to execute.
- `sell_stock`: Places a SELL order for an NSE equity. Requires `confirm: true` to execute.

## Safety Note

Live trading actions involve executing transactions on the stock exchange. **Always review orders carefully.** The BUY and SELL tools include an explicit `confirm: true` guard. Without explicitly passing confirmation, the tools act as a Dry Run to echo the transaction parameters back to the client.

## Development

Run tests with mocking (no network calls):
```bash
npm test
```

Type checking:
```bash
npm run typecheck
```
