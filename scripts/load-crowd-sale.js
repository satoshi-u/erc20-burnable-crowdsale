// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const Web3 = require('web3');
const TestToken = require('../artifacts/contracts/TestToken.sol/TestToken.json')
require('dotenv').config();
const Tx = require('ethereumjs-tx').Transaction;


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


    // web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${infuraKey}`));
    let web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/1917f7029c8c4c25832fadcf633a9116`))
    console.log("web3:", web3);


    const TestTokenAddrRopsten = "0xF77A61E3dd50b1382e305074c1FFF28820413AaA";
    const CrowdSaleAddrRopsten = "0x819c067AE319bd4CB549f61977Ca41650457d2E5";
    const ownerAddr = "0x5D7E7B133E5f16C75A18e3b04Ac9Af85451C209c";
    // Load TestToken
    const testToken = new web3.eth.Contract(TestToken.abi, TestTokenAddrRopsten);
    console.log("testToken:", testToken);

    const topUpCrowdSale = "100000000000000000000000";
    let crowdSaleBalance = await testToken.methods.balanceOf(CrowdSaleAddrRopsten).call();
    console.log("balance crowdSaleBalance before transfer:", crowdSaleBalance);

    // // let result = await testToken.connect(owner).transfer(crowdSale.address, topUpCrowdSale); // 100000 gone from owner to crowdSale
    // const _gasPrice = await web3.eth.getGasPrice();
    // const _gasLimit = "3000000";
    // console.log("_gasPrice : ", _gasPrice);
    // console.log("_gasLimit : ", _gasLimit);
    // const txData = {
    //     gasLimit: web3.utils.toHex(_gasLimit),
    //     gasPrice: web3.utils.toHex(_gasPrice),
    //     to: TestTokenAddrRopsten,
    //     data: testToken.methods.transfer(CrowdSaleAddrRopsten, topUpCrowdSale).encodeABI(),
    //     // value: web3.utils.toHex(_value) // thanks @abel30567
    // }
    // const privateKey = Buffer.from(
    //     process.env.ETH_MAIN_PVT,
    //     'hex',
    // )
    // // get the number of transactions sent so far so we can create a fresh nonce
    // web3.eth.getTransactionCount(ownerAddr, 'latest').then(txCount => {
    //     const newNonce = web3.utils.toHex(txCount)
    //     const transaction = new Tx({ ...txData, nonce: newNonce }, { chain: 'ropsten' }) // or 'rinkeby'
    //     transaction.sign(privateKey)
    //     const serializedTx = transaction.serialize().toString('hex');
    //     return web3.eth.sendSignedTransaction('0x' + serializedTx)
    // }).then(result => {
    //     console.log("txnHash: ", result.transactionHash);
    // })

    // crowdSaleBalance = await testToken.methods.balanceOf(CrowdSaleAddrRopsten).call();
    // console.log("balance crowdSaleBalance after transfer:", crowdSaleBalance);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

