import { KiteConnect } from "kiteconnect";
import { config } from "../config.js";

let globalClient: any = null;

export function getKiteClient(): any {
  if (globalClient) {
    return globalClient;
  }

  const client = new KiteConnect({
    api_key: config.KITE_API_KEY,
  });

  if (config.KITE_ACCESS_TOKEN) {
    client.setAccessToken(config.KITE_ACCESS_TOKEN);
  }

  globalClient = client;
  return client;
}

export function setKiteClient(client: any) {
  globalClient = client;
}

export function getLoginUrl() {
  const client = new KiteConnect({ api_key: config.KITE_API_KEY });
  return client.getLoginURL();
}
