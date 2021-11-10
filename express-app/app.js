require('dotenv').config();
const express = require('express')
const app = express()
const testTokenRoutes = require('./routes/testToken')
const TestToken = require('../artifacts/contracts/TestToken.sol/TestToken.json')
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
const TestTokenAddrRopsten = "0x305D515885a8AD4FC325B43753C1A04d4D42a37e";
// Load TestToken
const testToken = new web3.eth.Contract(TestToken.abi, TestTokenAddrRopsten);

// set routes
testTokenRoutes(app, web3, testToken);

// start listening
app.listen(process.env.PORT || 8082, () => {
    console.log('listening on port ' + (process.env.PORT || 8082));
})
