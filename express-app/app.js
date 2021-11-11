require('dotenv').config();
const express = require('express')
const app = express()
const routes = require('./routes/master')
const TestToken = require('../artifacts/contracts/TestToken.sol/TestToken.json')
const CrowdSale = require('../artifacts/contracts/CrowdSale.sol/CrowdSale.json')
const Web3 = require('web3');

app.use(express.json())

let web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
} else {
    // web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${infuraKey}`));
    web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/1917f7029c8c4c25832fadcf633a9116`))
}

// const accounts = await web3.eth.getAccounts();
// console.log('accounts :' + accounts);
const TestTokenAddrRopsten = "0xF77A61E3dd50b1382e305074c1FFF28820413AaA";
const CrowdSaleAddrRopsten = "0x819c067AE319bd4CB549f61977Ca41650457d2E5";
// Load TestToken
const testToken = new web3.eth.Contract(TestToken.abi, TestTokenAddrRopsten);
// Load CrowdSale
const crowdSale = new web3.eth.Contract(CrowdSale.abi, CrowdSaleAddrRopsten);

// set routes
routes(app, web3, testToken, crowdSale);

// start listening
app.listen(process.env.PORT || 8082, () => {
    console.log('listening on port ' + (process.env.PORT || 8082));
})
