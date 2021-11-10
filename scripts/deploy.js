// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  // TestToken deployed to: 0x305D515885a8AD4FC325B43753C1A04d4D42a37e
  // CrowdSale deployed to: 0xACCB10923726544A91c95C34f71D461cfe2f5afb

  const totalSupply = "1000000000000000000000000";
  const tokenPrice = "1000000000000000"; // 0.001 ETH or 1000000000000000 WEI => 100 tokens / 0.1 ETH
  const maxEthDeposit = "10000000000000000000"; //10 ETH or 10000000000000000000 WEI
  const maxPerTxnEthDeposit = "500000000000000000"; // 0.5 ETH or 500000000000000000 WEI

  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy(totalSupply);
  console.log("TestToken deployed to:", testToken.address);

  const CrowdSale = await hre.ethers.getContractFactory("CrowdSale");
  const crowdSale = await CrowdSale.deploy(testToken.address, tokenPrice, maxEthDeposit, maxPerTxnEthDeposit);
  console.log("CrowdSale deployed to:", crowdSale.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
