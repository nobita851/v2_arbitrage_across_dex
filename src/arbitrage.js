require("dotenv").config();
const ethers = require("ethers");
const bot_abi = require("../artifacts/contracts/arbitrage.sol/arbitrage.json");
const v2_abi = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");

const logs = require("./logs");


const { Logger } = require("ethers/lib/utils");

const router = {
  uniswap: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  sushiswap: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  shibaswap: "0x03f7724180AA6b939894B5Ca4314783B0b36b329",
  sakeswap: "0x9C578b573EdE001b95d51a55A3FAfb45f5608b1f",
  croswap: "0xCeB90E4C17d626BE0fACd78b79c9c87d7ca181b3",
};

let signer;
let provider

let bot;
let balanceToken0;

let sellRouter;
let buyRouter;

async function setup(botAddress){
    signer = new ethers.Wallet(process.env.privateKey1, process.env.RPCprovider);
    provider = new ethers.providers.JsonRpcProvider(process.env.RPCprovider);

    bot = new ethers.Contract(botAddress, bot_abi, provider);
    
    balance = await bot.checkBalance();
    balanceToken0 = balance[0];
}

async function findTrade(){
    routerContract = new ethers.Contract(router["uniswap"], v2_abi, provider)

    max = await bot.getAmountOut(router["uniswap"], ethers.utils.parseUnits("10000.0", 18));
    min = max;
    Object.keys(router).forEach(async (element) => {
        temp = await bot.getAmountOut(router[element], ethers.utils.parseUnits("10000.0", 18));
        if(max.lt(temp)){
            max = temp;
            buyRouter = router[element];
        }
        if(min.gt(temp)){
            min = temp;
            sellRouter = router[element];
        }
    });
}

async function trade(botAddress){
    setup(botAddress)
    await findTrade();
    try{
        transact = await bot.connect(signer).trade(buyRouter, sellRouter);
        transactReceipt = await transact.wait();
        logs.info(`Arbitrage Successful at TxHash: ${transactReceipt.transactionHash}`)
    } catch (e) {
        
        if (err.code === Logger.errors.CALL_EXCEPTION){
            console.log(`Transaction failed! \n ${err.transactionHash}`);
            logs.error(`Arbitrage Failed! Missing revert statement. \nTxHash: ${err.transactionHash}`);
        }
        if (err.data){ 
            console.log(err.data.message);
            logs.error(`Arbitrage Failed with reason: ${err}`);
        }
        else if (err.message){
            console.log(err.message);
            logs.error(`Arbitrage Failed with reason: ${err}`);
        }
        else if (typeof err == "string"){
            console.log(err);
            logs.error(`Arbitrage Failed with reason: ${err}`);
        }
        else {
            console.log("Unable to fetch reason for failure");
            logs.error(`Arbitrage Failed! Unable to fetch reason for failure.`);
        }
    }
}

module.exports = trade;