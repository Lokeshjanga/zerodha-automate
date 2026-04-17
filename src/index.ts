import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { toolsDefinition, handleToolCall } from "./mcp/tools.js";

// Ensure config is loaded
import "./config.js";

const server = new Server(
  {
    name: "zerodha-trade-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: toolsDefinition };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return (await handleToolCall(name, args || {})) as any;
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Zerodha MCP Server running over stdio");
}

run().catch(error => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
