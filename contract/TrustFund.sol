// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE }
    
    State public currState;
    address public buyer;
    address payable public seller;
    uint256 public amount;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this method");
        _;
    }
    
    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }
    
    constructor(address _buyer, address payable _seller) {
        buyer = _buyer;
        seller = _seller;
        currState = State.AWAITING_PAYMENT;
    }
    
    function deposit() external onlyBuyer payable {
        require(currState == State.AWAITING_PAYMENT, "Already paid");
        require(msg.value > 0, "Deposit must be greater than 0");
        amount = msg.value;
        currState = State.AWAITING_DELIVERY;
    }
    
    function confirmDelivery() external onlyBuyer {
        require(currState == State.AWAITING_DELIVERY, "Cannot confirm delivery");
        seller.transfer(amount);
        currState = State.COMPLETE;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}