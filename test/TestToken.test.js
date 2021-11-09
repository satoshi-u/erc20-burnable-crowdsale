const { ethers } = require("hardhat");
const { expect } = require("chai");

let testToken;
let accounts;
let owner;
let testAccount;

before(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    testAccount = accounts[1];

    const TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy("1000000000000000000000000"); // 1000000 * 1000000000000000000 = 1000000000000000000000000
    await testToken.deployed();
})

describe("test-token", function () {
    let name, symbol, decimals;
    let totalSupply, balance;
    let result;

    it('initializes Token optional details', async function () {
        name = await testToken.name();
        expect(name).to.equal("Test Token", "doesn't have correct token name!");
        symbol = await testToken.symbol();
        expect(symbol).to.equal("TEST", "doesn't have correct token name!");
        decimals = await testToken.decimals();
        expect(decimals).to.equal(18, "doesn't have correct decimals!");
    })

    it('sets the total supply and allocates initial supply upon deployment', async function () {
        totalSupply = await testToken.totalSupply();
        expect(totalSupply).to.equal("1000000000000000000000000", "doesn't have correct total supply!"); // 1000000
        balance = await testToken.balanceOf(owner.address);
        expect(balance).to.equal("1000000000000000000000000", "doesn't allocate correct initial supply to owner!"); // 1000000
    })

    it('transfers tokens correctly, and burns 2% from sender', async function () {
        // await expect(
        //     testToken.connect(owner).transfer(testAccount.address, "1000000000000000000000000") // 1000000, but 900000 left
        // ).to.be.revertedWith("?");
        result = await testToken.connect(owner).transfer(testAccount.address, "100000000000000000000"); // 100
        balance = await testToken.balanceOf(testAccount.address);
        expect(balance).to.equal("100000000000000000000", "test account credit incorrect!"); // 100
        balance = await testToken.balanceOf(owner.address);
        expect(balance).to.equal("999898000000000000000000", "owner debit incorrect!"); // 999898 (102 gone)
    })
});
