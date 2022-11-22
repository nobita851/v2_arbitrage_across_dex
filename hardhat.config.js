/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    hardhat: {
    },
    goerli: {
      url: process.env.RPCprovider,
      accounts: [process.env.privateKey1]
    }
  },
  solidity: "0.8.4",

};
