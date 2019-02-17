# Cross-Chain-Pacman

## Hackathon
ETHDenver: 15-17 February, 2019

## Tagline:
The world is going to be chain-agnostic! Here is the proof!


## Detailed Project Description
Play cross-chain pacman in your browser. Its a proof-of-concept where one user can choose to play over Zilliqa blockchain and other one can play over Ropsten test network (Ethereum). The game seamlessly records who is winning and allows the swap of a digital sword to the winner. Along with Zilliqa and Ethereum, the game is currently using browser's own local storage as an off-chain oracle. Next task is to move this oracle to an Internet based database.


## Describe your tech stack (e.g., protocols, languages, API’s, etc.)
Solidity, Scilla, JavaScript, CSS, HTML5

## Demo
Just clone the folder on your computer and once in the folder, run command `http-server`. Make sure you have already installed `http-server` from npm and your MetaMask is set to Ropsten and has some ETH in to cover the gas charges.

To play, open `localhost:8080` in two tabs under same browser. Set one player for Ethereum and other for Zilliqa and play! The top score will get the sword of Aragorn as a reward. As users continue to play, the sword will keep switching between them based on the highest score.

## Understanding the code

1. Find `contracts/HelloEthereum.scilla` and `contracts/HelloZilliqa.sol` in the project folder.
2. Deploy `contracts/HelloZilliqa.sol` to your favourite Ethereum testnet using remix IDE. I used ropsten and source code has ropsten contract address.
3. For deploying `contracts/HelloEthereum.scilla` on Zilliqa dev-net you will need to follow the quickstart example given [here](https://github.com/Zilliqa/Zilliqa-JavaScript-Library). For cross-reference you can see my deployment script provided in `zillia-deployment-script/deployToZilliqa.js`.
4. Change to your ethereum testnet contract address in `js/ethereum.js`.
5. Change to your Zilliqa wallet private key in `js/zilliqa.js`.
6. To make the game compatible with IPFS, I browserified the Zilliqa-JavaScript-Library and included useful libraries here as `js/zilliqa-lib.js`.
7. All ethereum and zilliqa contract interaction functions are in `js/ethereum.js` and `js/zilliqa.js`.
