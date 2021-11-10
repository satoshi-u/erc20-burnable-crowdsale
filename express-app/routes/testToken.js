require('dotenv').config();
const Tx = require('ethereumjs-tx').Transaction;

const ownerAddr = "0x5D7E7B133E5f16C75A18e3b04Ac9Af85451C209c";
const TestTokenAddrRopsten = "0x305D515885a8AD4FC325B43753C1A04d4D42a37e";

/** Signs the given transaction data and sends it. Abstracts some of the details of 
  * buffering and serializing the transaction for web3.
  * @returns A promise of an object that emits events: transactionHash, receipt, confirmaton, error
*/

function routes(app, web3, testToken) {

    app.get('/owner-balance', async (req, res) => {
        let ownerBalance = await testToken.methods.balanceOf(ownerAddr).call();
        console.log('ownerBalance:' + ownerBalance);
        res.send(ownerBalance);
    })

    app.get('/decimals', async (req, res) => {
        let decimals = await testToken.methods.decimals().call();
        console.log('decimals:' + decimals);
        res.send(decimals);
    })

    app.post('/transfer', async (req, res) => {
        // const _gasPrice = (await web3.eth.getGasPrice()) + '000000'
        // console.log("_gasPrice : ", _gasPrice);
        let _toAddr = req.body._toAddr;
        let _value = req.body._value;
        const txData = {
            // gasLimit: web3.eth.getBlock("latest").gasLimit,
            // gasPrice: '0x' + _gasPrice.toString('hex'),
            gasLimit: web3.utils.toHex(1580000), // 0.02 eth
            gasPrice: web3.utils.toHex(158000000000), // 158000000000 wei - metamask
            to: TestTokenAddrRopsten,
            data: testToken.methods.transfer(_toAddr, _value).encodeABI()
        }
        console.log('txData:', txData.toString())

        console.log('process.env.ETH_MAIN_PVT:', process.env.ETH_MAIN_PVT)
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
