const {ethers} = require("hardhat");
const { writeFile }  = require("fs");

async function deployBot(token0, token1){
    
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];

    args = [token0, token1];

    const factory = await ethers.getContractFactory("arbitrage");
    const arbitrage = await factory.deploy(token0, token1);

    await arbitrage.deployed();

    console.log("Bot Address: ", arbitrage.address);

    // var code = `export function botAddress(){ return ${arbitrage.address} ;}`;
    // writeFile("botAddress.js", code, function (err) {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   console.log("Bot Address saved!");
    // });
}

async function main(){

    token0 = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    token1 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    await deployBot(token0, token1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
