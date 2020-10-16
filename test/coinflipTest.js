const Coinflip = artifacts.require("Coinflip");
const truffleAssert = require("truffle-assertions");


contract("Coinflip", async function(accounts){

    let instance;

    before(async function(){
        instance = await Coinflip.deployed();
    });

    it("should place a bet", async function(){
        await truffleAssert.passes(instance.placeBet({value: 1e16, from:accounts[1]}), truffleAssert.ErrorType.REVERT);
    });

    it("shouldn't exceed bet limit", async function(){
        await truffleAssert.fails(instance.placeBet({value: 1e18, from:accounts[1]}), truffleAssert.ErrorType.REVERT);
    });

    it("should allow owner to fund contract", async function(){
        await truffleAssert.passes(instance.deposit({value: 1e17, from:accounts[0]}), truffleAssert.ErrorType.REVERT);
    });

    it("should allow only owner to withdraw", async function(){
        await truffleAssert.fails(instance.withdraw(1, {from:accounts[1]}), truffleAssert.ErrorType.REVERT);
    });

    it("should allow owner to withdraw", async function(){
        await truffleAssert.passes(instance.withdraw(1, {from:accounts[0]}), truffleAssert.ErrorType.REVERT);
    });
});
