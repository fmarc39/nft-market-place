require("@nomiclabs/hardhat-waffle");

const projectId = "0bde4451fec140b0b6908eb541d38ea9";

// This is a sample Hardhat task. To learn how to create your own go to
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [],
    },
  },
  solidity: "0.8.4",
};
