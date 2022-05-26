require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

const infuraProjectId = process.env.INFURA_PROJECT_ID
const privateKey0 = process.env.PRIVATE_KEY_0
const etherscanApiKey = process.env.ETHERSCAN_API_KEY
const binanceApiKey = process.env.BINANCE_API_KEY
const polygonApiKey = process.env.POLYGONSCAN_API_KEY

module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    binance: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [privateKey0]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      accounts: [privateKey0]
    },
    polygon: {
      url: `https://polygon-rpc.com/`,
      accounts: [privateKey0]
    },
    polygonTestnet: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts: [privateKey0]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          }
        }
      }
    ]
  },
  etherscan: {
    apiKey: polygonApiKey
  }
}