const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");
const provider = waffle.provider;

let testToken;
let crowdSale;
let accounts;
let owner;
let testAccount;

const totalSupply = "1000000000000000000000000";
const tokenPrice = "1000000000000000"; // 0.001 ETH or 1000000000000000 WEI => 100 tokens / 0.1 ETH
const maxEthDeposit = "10000000000000000000"; //10 ETH or 10000000000000000000 WEI
const maxPerTxnEthDeposit = "500000000000000000"; // 0.5 ETH or 500000000000000000 WEI

before(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    testAccount = accounts[1];

    const TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy(totalSupply);
    await testToken.deployed();

    const CrowdSale = await ethers.getContractFactory("CrowdSale");
    crowdSale = await CrowdSale.deploy(testToken.address, tokenPrice, maxEthDeposit, maxPerTxnEthDeposit);
    await crowdSale.deployed();
})

describe("crowd-sale", function () {
    it('initializes Crowd Sale contract with correct values', async function () {
        let _testTokenAddr = await crowdSale.testToken;
        expect(_testTokenAddr).to.not.equal(0x0, "doesn't have testToken instance correctly initialized!");

        let _tokenPrice = await crowdSale.tokenPrice();
        expect(_tokenPrice.toString()).to.equal(tokenPrice, "incorrect token price!");

        let _maxEthDeposit = await crowdSale.maxEthDeposit();
        expect(_maxEthDeposit.toString()).to.equal(maxEthDeposit, "incorrect maxEthDeposit!");

        let _maxPerTxnEthDeposit = await crowdSale.maxPerTxnEthDeposit();
        expect(_maxPerTxnEthDeposit.toString()).to.equal(maxPerTxnEthDeposit, "incorrect maxPerTxnEthDeposit!");
    })

    let result, balance;
    it('facilitates token buying by depositing Eth', async function () {
        // FIRST TRANSFER FROM OWNER TO CROWDSALE CONTRACT- 100k
        balance = await testToken.balanceOf(crowdSale.address);
        result = await testToken.connect(owner).transfer(crowdSale.address, "100000000000000000000000"); // 100000 gone from owner to crowdSale

        // result = await crowdSale.connect(testAccount).buyTokens("100000000000000000000", { value: ethers.utils.parseEther("0.1") }); // 100 from crowdSale to testAccount(2 burn)
        // balance = await testToken.balanceOf(crowdSale.address);
        // expect(balance).to.equal("99898000000000000000000", "crowd-sale contract token balance incorrect after tokens were bought !"); // 100000 - 102 = 99898
        // balanceETH = await provider.getBalance(crowdSale.address);
        // expect(balanceETH).to.equal("100000000000000000", "crowd-sale contract ETH balance incorrect after tokens were bought !"); //  0.1 ETH in WEI here
        // balance = await testToken.balanceOf(testAccount.address);
        // expect(balance).to.equal("100000000000000000000", "test-account token balance incorrect after tokens were bought!"); // 100
        // // balanceETH = await provider.getBalance(testAccount.address); // can't expect as variable gas is also spent

        result = await crowdSale.connect(testAccount).depositEth({ value: ethers.utils.parseEther("0.1") }); // 100 from crowdSale to testAccount(2 burn)
        balance = await testToken.balanceOf(crowdSale.address);
        // console.log("token balance Of(crowdSale.address): ", balance.toString());
        expect(balance).to.equal("99898000000000000000000", "crowd-sale contract token balance incorrect after eth was deposited !"); // 100000 - 102 = 99898
        balanceETH = await provider.getBalance(crowdSale.address);
        // console.log("balanceETH (crowdSale.address): ", balanceETH.toString());
        expect(balanceETH).to.equal("100000000000000000", "crowd-sale contract ETH balance incorrect after eth was deposited !"); //  0.1 ETH in WEI here
        balance = await testToken.balanceOf(testAccount.address);
        // console.log("token balance Of(testAccount.address): ", balance.toString());
        expect(balance).to.equal("100000000000000000000", "test-account token balance incorrect after eth was deposited!"); // 100
        // balanceETH = await provider.getBalance(testAccount.address); // can't expect as variable gas is also spent
    })

    it('ends token sale and returns balance tokens to contract owner', async function () {
        // FIRST TRANSFER FROM OWNER TO CROWDSALE CONTRACT- 100k
        let balance = await testToken.balanceOf(crowdSale.address);
        let result = await testToken.connect(owner).transfer(crowdSale.address, "100000000000000000000000"); // 100000 gone from owner to crowdSale
        result = await crowdSale.connect(owner).endSale();
        balance = await testToken.balanceOf(owner.address);
        // expect(balance.toString()).to.equal("995898000000000000000000", "balance not retreived from contract to owner");
    })
})
