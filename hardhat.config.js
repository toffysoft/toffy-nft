/* eslint-disable no-undef */
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

// console.log({
//   mnemonic: process.env.MNEMONIC,
//   defaultNetwork: process.env.DEFAULT_NETWORK,
// });

const mnemonic = process.env.MNEMONIC;

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: process.env.DEFAULT_NETWORK,
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      // gasPrice: 5 * 1e9,
      // accounts: { mnemonic: mnemonic },
    },
    thaichain: {
      url: 'https://rpc.tch.in.th',
      chainId: 7,
      gasPrice: 20 * 1e9,
      accounts: { mnemonic: mnemonic },
    },
    bitkub: {
      url: 'https://rpc.bitkubchain.io',
      chainId: 96,
      gasPrice: 50 * 1e9,
      accounts: { mnemonic: mnemonic },
    },
    bsc_testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20 * 1e9,
      accounts: { mnemonic: mnemonic },
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 5 * 1e9,
      accounts: { mnemonic: mnemonic },
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      chainId: 137,
      // gasPrice: 5 * 1e9,
      accounts: { mnemonic: mnemonic },
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      chainId: 4,
      // gasPrice: 5 * 1e9,
      accounts: { mnemonic: mnemonic },
    },
  },
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    sources: './contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 20000,
  },
};
