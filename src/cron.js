const arbitrage = require("./arbitrage");
const cron = require("node-cron");
// const botAddress = require("../helpers/botAddress.js");

cron.schedule("* * * * *", async () => {
  console.log("Running Arbitrage every minute");
  await arbitrage.trade("0x5FbDB2315678afecb367f032d93F642f64180aa3");
});
