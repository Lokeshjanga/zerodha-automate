import { KiteConnect } from "kiteconnect";

const apiKey = "rrtrf95lc7bheftg";
// const apiSecret = "sui12otuq8zzrrrshaln2vsjz6u77cut";
// const requestToken = "QeODAUEzgdDSoULSRdWkBfbodkK46E72";
let access_token = "l81ThiWlfHkimyy6hJCz67A5SbSydyKf";

const kc = new KiteConnect({ api_key: apiKey });
console.log(kc.getLoginURL());

kc.setAccessToken(access_token);
export async function placeOrder(tradingsymbol: string, quantity: number, q_type: "BUY"| "SELL") {
    try {
        // await generateSession();
    await kc.placeOrder("regular" ,{
        exchange: "NSE",
        tradingsymbol,
        transaction_type: q_type,
        quantity,
        product:"CNC",
        order_type:"MARKET",
        validity:"DAY"
    })
  } catch (err) {
    console.error(err);
  }
}
export async function getHoldings() {
    try {
        // await generateSession();
        const getHoldings = await kc.getHoldings();
        let allHoldings = "";
        getHoldings.map(holding =>{
            allHoldings += `${holding.tradingsymbol} : ${holding.quantity}\n , ${holding.price}`;
        })
        return allHoldings;
    
  } catch (err) {
    console.error(err);
  }
}

export async function getFunds()
{
  try{
    const funds = await kc.getMargins();
    let totalCash = 0;
  for (const segment in funds) {
    const segmentData = funds.equity;
    if (segmentData?.available?.cash) {
      totalCash += segmentData.available.cash;
    }
  }
  return totalCash;
  
}
catch(err)
{
  console.error(err);
}
}

// async function generateSession() {
//   try {
//     const response = await kc.generateSession(requestToken, apiSecret);
//     console.log("access token " + response.access_token);
//     // kc.setAccessToken(response.access_token);
//     console.log("Session generated:", response);
//   } catch (err) {
//     console.error("Error generating session:", err);
//   }
// }
// await generateSession();

