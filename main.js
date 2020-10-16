var web3 = new Web3(Web3.givenProvider);
var contractInstance;

var amount;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0xEd106E9dBC1D397E0aC60913b81C169352667625", {from: accounts[0]});
      console.log(contractInstance);

      $("#bet").click(placeBet);
      $("#viewBalance").click(viewBalance);
      $("#depositButton").click(deposit);
      $("#withdrawButton").click(withdraw);

      var message;

      var outcome = contractInstance.events.generatedRandomNumber(function(err, res) {

        if(err){
          console.log(err);
        }
        else {
          console.log(res.returnValues[0]);
          if(res.returnValues[0] == 1){
            message = ("You won " + 9*amount/10 + " ETH");
            alert (message);
          }
          else if(res.returnValues[0] == 0){
            message = ("You lost " + amount + " ETH");
            alert (message);
          }
        }
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        $("#entries tbody").prepend($("<tr><td>"+ time +"</td><td>"+ message +"</td></tr>"));
    });
  });
});

function placeBet(){
    amount = $("#amount").val();
    let config = {
        value: web3.utils.toWei(amount,"ether")
    }

    contractInstance.methods.placeBet().send(config)
    .on("transactionHash", function(hash){
        console.log(hash);
        alert("Bet taken! Waiting for result...")
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    });
};

function viewBalance(){
      contractInstance.methods.viewBalance().call().then(function(res){
        console.log(res);
        $("#balance").text(res/1e18 + " ETH");
      })
};

function deposit(){
    let depAmount = $("#deposit").val();
    let depConfig = {
        value: web3.utils.toWei(depAmount,"ether")
    }
    contractInstance.methods.deposit().send(depConfig)
    .on("transactionHash", function(hash){
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    })
};

function withdraw(){

    let withAmount = $("#withdraw").val();
    let withConfig = Number({
        value: web3.utils.toWei(withAmount,"ether")
    })

    contractInstance.methods.withdraw(withConfig).send(withConfig)
    .on("transactionHash", function(hash){
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    })
};

 function darkMode() {
   var element = document.body;
   element.classList.toggle("darkMode");
 };
