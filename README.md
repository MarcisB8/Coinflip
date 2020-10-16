# Coinflip

This is the final exercise of Ivan on Tech Blockchain Academy course Solidity 201. 
It is a betting dApp where users have a 50% chance to win or lose. The result of a bet is provided by off-chain oracle to implement real randomness. 
When placing a bet, the contract makes sure:
- there is no pending bet from player's address already,
- the bet is not higher than 1/5 of contract's balance to decrease the possiblility of running out,
- the player has entered an amount.
In case of a winning bet, the player gets his initial bet + 0.9 of it. In case of a losing bet, contract keeps the bet. 
The address that deployed the contract has access to viewBalance, deposit and withdraw functions. 
