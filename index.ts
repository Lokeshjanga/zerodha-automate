import { KiteConnect } from "kiteconnect";
import { getFunds, getHoldings, placeOrder } from "./Trade";

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// // Add an addition tool
// server.tool("add",
//   { a: z.number(), b: z.number() },
//   async ({ a, b }) => ({
//     content: [{ type: "text", text: String(a + b) }]
//   })
// );

// // Add a dynamic greeting resource
// server.tool("factorial" , 
//   {a:z.number()},
//   async({a})=>{
//     let fact = 1;
//     for(let i = 1; i <= a; i++){
//       fact *= i;
//     }
//     return {content: [{type: "text", text: String(fact)}]}
//   }
//   )

server.tool("buy" , "Buys stock on zerodha exchange for the user ",
  {symbol: z.string(), quantity: z.number()},
  async({symbol, quantity})=>{
    await placeOrder(symbol, quantity, "BUY");
    return {content: [{type: "text", text: `Successfully placed BUY order for ${quantity} shares of ${symbol}`}]}
  }
)

server.tool("sell" , "Sells stock on zerodha exchange for the user ",
  {symbol: z.string(), quantity: z.number()},
  async({symbol, quantity})=>{
    await placeOrder(symbol, quantity, "SELL");
    return {content: [{type: "text", text: `Successfully placed BUY order for ${quantity} shares of ${symbol}`}]}
  }
)

server.tool("show_portfolio",
  { },
  async()=>{
    const holdings = await getHoldings();
    if(!holdings)
    {
      return {content: [{type: "text", text: "No holdings found"}]}
    }
    return {content: [{type: "text", text: holdings}]}
  }
)

server.tool(
  "get_funds",
  "Gets my total account balance",
  {},
  async () => {
    try {
      const funds = await getFunds();
      if (funds === 0) {
        return { content: [{ type: "text", text: "No funds found" }] };
      }
      return { content: [{ type: "text", text: `₹${funds}` }] };
    } catch (error) {
      console.error("Error in get_funds:", error);
      return {
        content: [{ type: "text", text: "Failed to fetch funds. Please try again." }],
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("MCP server is now running and listening for connections...");

// placeOrder("HDFCBANK", 1, "BUY");

// const apiKey = "rrtrf95lc7bheftg";
// // const apiSecret = "sui12otuq8zzrrrshaln2vsjz6u77cut";
// // const requestToken = "qCJW0g3bhph72a64kwiCf5YmeLax7qe0";
// let access_token = "avHSIkBnksxqYJdhrUd71vjIOrfSz4Ff";

// const kc = new KiteConnect({ api_key: apiKey });
// console.log(kc.getLoginURL());

// async function init() {
//   try {
//     // await generateSession();
//     kc.setAccessToken(access_token)
//     await getProfile();
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function generateSession() {
//   try {
//     const response = await kc.generateSession(requestToken, apiSecret);
//     console.log(response.access_token);
//     kc.setAccessToken(response.access_token);
//     console.log("Session generated:", response);
//   } catch (err) {
//     console.error("Error generating session:", err);
//   }
// }

// async function getProfile() {
//   try {
//     const profile = await kc.getProfile();
//     console.log("Profile:", profile);
//   } catch (err) {
//     console.error("Error getting profile:", err);
//   }
// }
// Initialize the API calls
// init();