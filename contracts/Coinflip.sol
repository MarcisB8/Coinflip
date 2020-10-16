import "./Destroyable.sol";
import "./provableAPI.sol";
pragma solidity 0.5.12;

contract Coinflip is Destroyable, usingProvable {

    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 public latestNumber;

    address payable public player;
    uint betAmount;
    bool pendingBet = false;

    event logNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);

    function placeBet () public payable {

        player = msg.sender;
        betAmount = msg.value;

        require (pendingBet == false, "Bet pending already");
        require (betAmount > 0, "Bet not entered");
        require (betAmount <= address(this).balance/5, "Bet limit exceeded");

        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK =200000;
        provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK);

        emit logNewProvableQuery ("Provable query was sent, waiting for the callback");
        pendingBet = true;
    }

    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {

        require(msg.sender == provable_cbAddress());

        uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;

        if (randomNumber == 1){
            player.transfer(19*betAmount/10);
        }

        emit generatedRandomNumber(randomNumber);
        pendingBet = false;
    }

    function viewBalance () public view onlyOwner returns (uint) {

        return address(this).balance;
    }

    function deposit() public payable onlyOwner {

        require(msg.value > 0);
    }

    function withdraw (uint profit) public onlyOwner returns (uint){

        require (profit <= address(this).balance);
        msg.sender.transfer(profit);
        return profit;
    }
}
