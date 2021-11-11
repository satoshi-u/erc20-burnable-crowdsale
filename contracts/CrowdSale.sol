// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "./TestToken.sol";
import "hardhat/console.sol";

contract CrowdSale {
    address admin;
    TestToken public testToken;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    uint256 public maxEthDeposit;
    uint256 public maxPerTxnEthDeposit;

    constructor(
        TestToken _testToken,
        uint256 _tokenPrice,
        uint256 _maxEthDeposit,
        uint256 _maxPerTxnEthDeposit
    ) {
        admin = address(msg.sender);
        testToken = _testToken;
        tokenPrice = _tokenPrice; // 0.001 ETH( 1000000000000000 WEI) => 100 tokens / 0.1 ETH
        maxEthDeposit = _maxEthDeposit; //10 ETH or 10000000000000000000 WEI
        maxPerTxnEthDeposit = _maxPerTxnEthDeposit; // 0.5 ETH OR 500000000000000000 WEI
    }

    event Sold(address _buyer, uint256 _numberOfTokens);

    function calculateTokensForEth(uint256 ethInWei)
        public
        view
        returns (uint256 numberOfTokens)
    {
        numberOfTokens = (ethInWei * 10**18) / tokenPrice;
    }

    function depositEth() public payable {
        require(
            msg.value <= maxPerTxnEthDeposit,
            "max limit crossed for eth deposit txn"
        );
        require(
            address(this).balance <= maxEthDeposit,
            "contract eth deposit limit reached"
        );
        uint256 _numberOfTokens = calculateTokensForEth(msg.value);
        // _numberOfTokens += (_numberOfTokens * 2) / 100;
        require(
            testToken.balanceOf(address(this)) >= _numberOfTokens,
            "contract doesn't have enough token balance"
        );
        require(testToken.transfer(msg.sender, _numberOfTokens));
        tokensSold += _numberOfTokens;
        emit Sold(msg.sender, _numberOfTokens);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(
            msg.value <= maxPerTxnEthDeposit,
            "max limit crossed for deposit txn"
        );
        require(
            address(this).balance <= maxEthDeposit,
            "contract deposit limit reached"
        );
        require(
            msg.value >= (_numberOfTokens * tokenPrice) / 1000000000000000000,
            "insufficient eth deposit for tokens requested"
        ); // ==
        require(
            testToken.balanceOf(address(this)) >= _numberOfTokens,
            "contract doesn't have enough balance"
        );

        require(testToken.transfer(msg.sender, _numberOfTokens));
        tokensSold += _numberOfTokens;
        emit Sold(msg.sender, _numberOfTokens);
    }

    function endSale() public payable {
        require(msg.sender == admin);
        require(testToken.transfer(admin, testToken.balanceOf(address(this))));
        selfdestruct(payable(admin));
    }
}
