require('dotenv').config();
const Tx = require('ethereumjs-tx').Transaction;

// TestToken deployed to: 0xF77A61E3dd50b1382e305074c1FFF28820413AaA
// CrowdSale deployed to: 0x819c067AE319bd4CB549f61977Ca41650457d2E5
const testAddr = "0x00934685C430777b911940d160B9aa00e6590eAe";
const ownerAddr = "0x5D7E7B133E5f16C75A18e3b04Ac9Af85451C209c";
const TestTokenAddrRopsten = "0xF77A61E3dd50b1382e305074c1FFF28820413AaA";
const CrowdSaleAddrRopsten = "0x819c067AE319bd4CB549f61977Ca41650457d2E5";

/** Signs the given transaction data and sends it. Abstracts some of the details of 
  * buffering and serializing the transaction for web3.
  * @returns A promise of an object that emits events: transactionHash, receipt, confirmaton, error
*/

function routes(app, web3, testToken, crowdSale) {

    app.get('/owner-balance', async (req, res) => {
        let ownerBalance = await testToken.methods.balanceOf(ownerAddr).call();
        console.log('ownerBalance:' + ownerBalance);
        res.send(ownerBalance);
    })

    app.get('/test-balance', async (req, res) => {
        let testBalance = await testToken.methods.balanceOf(testAddr).call();
        console.log('testBalance:' + testBalance);
        res.send(testBalance);
    })

    app.get('/decimals', async (req, res) => {
        let decimals = await testToken.methods.decimals().call();
        console.log('decimals:' + decimals);
        res.send(decimals);
    })

    app.post('/transfer', async (req, res) => {
        const _gasPrice = await web3.eth.getGasPrice();
        // const _gasLimit = await web3.eth.getBlock("latest").gasLimit;
        let _toAddr = req.body._toAddr;
        let _value = req.body._value;
        const txData = {
            // gasLimit: web3.eth.getBlock("latest").gasLimit,
            // gasPrice: '0x' + _gasPrice.toString('hex'),
            gasLimit: web3.utils.toHex("3000000"), // 0.02 eth // 30000000
            gasPrice: web3.utils.toHex(_gasPrice), // 158000000000 wei - metamask
            to: TestTokenAddrRopsten,
            data: testToken.methods.transfer(_toAddr, _value).encodeABI()
        }
        const privateKey = Buffer.from(
            process.env.ETH_MAIN_PVT,
            'hex',
        )
        // get the number of transactions sent so far so we can create a fresh nonce
        web3.eth.getTransactionCount(ownerAddr, 'latest').then(txCount => {
            const newNonce = web3.utils.toHex(txCount)
            const transaction = new Tx({ ...txData, nonce: newNonce }, { chain: 'ropsten' }) // or 'rinkeby'

            transaction.sign(privateKey)
            const serializedTx = transaction.serialize().toString('hex');
            return web3.eth.sendSignedTransaction('0x' + serializedTx)
        }).then(result => {
            console.log("result: ", result);
            res.json({ "txnHash": result.transactionHash })
        })
    })

    app.post('/deposit', async (req, res) => {
        const _gasPrice = await web3.eth.getGasPrice();
        // const _gasLimit = await web3.eth.getBlock("latest").gasLimit;
        let _value = req.body._value;
        const txData = {
            gasLimit: web3.utils.toHex("3000000"),
            gasPrice: web3.utils.toHex(_gasPrice),
            // gasLimit: web3.utils.toHex(1250000), // 0.02 eth
            // gasPrice: web3.utils.toHex(125000000000000), // 125000000000000 wei - metamask
            to: CrowdSaleAddrRopsten,
            data: crowdSale.methods.depositEth().encodeABI(),
            value: web3.utils.toHex(_value) // thanks @abel30567
        }
        const privateKey = Buffer.from(
            process.env.ETH_MAIN_PVT,
            'hex',
        )
        // get the number of transactions sent so far so we can create a fresh nonce
        web3.eth.getTransactionCount(ownerAddr, 'latest').then(txCount => {
            const newNonce = web3.utils.toHex(txCount)
            const transaction = new Tx({ ...txData, nonce: newNonce }, { chain: 'ropsten' }) // or 'rinkeby'

            transaction.sign(privateKey)
            const serializedTx = transaction.serialize().toString('hex');
            return web3.eth.sendSignedTransaction('0x' + serializedTx)
        }).then(result => {
            console.log("result: ", result);
            res.json({ "txnHash": result.transactionHash })
        })
    })
}

module.exports = routes
