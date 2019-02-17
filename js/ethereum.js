loadWeb3 = async function(){
      // Modern dapp browsers...
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      window.ssh = this.web3.shh;
      console.log(window.ssh)
      try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          //web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
      }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);

      // Acccounts always exposed
      //web3.eth.sendTransaction({/* ... */});
  }
  // Non-dapp browsers...
  else {
      window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/b8a2f3da69ed42e49780464311838538"));
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

var userWallet = "";
async function getAccount(){
  await web3.eth.getAccounts(function(error, accounts) {
     console.log(accounts[0]);
     userWallet = accounts[0];
 });

 zilEthPacman.events.player({

     }, function(error, event){ console.log(event); })
     .on('data', function(event){
         console.log(event); // same results as the optional callback above
     })
     .on('changed', function(event){
         // remove event from local database
     })
     .on('error', console.error);

}

var contractABI = "";
var contractAddress = "";
var zilEthPacman = "";

async function setupContractEthereum(){
  contractABI = [ { "constant": false, "inputs": [], "name": "reset", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_fName", "type": "string" }, { "name": "_age", "type": "uint256" } ], "name": "setPlayer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_sword", "type": "uint256" } ], "name": "setSword", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "age", "type": "uint256" } ], "name": "player", "type": "event" }, { "constant": true, "inputs": [], "name": "getPlayer", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getSword", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]
  contractAddress = '0x72496aa8089fc9adddef6b0fcfa40366340abe93';
  zilEthPacman = new web3.eth.Contract(contractABI, contractAddress);
}

async function sendTx(txObject, value = 0) {
  const nonce = await web3.eth.getTransactionCount(userWallet);
  console.log(nonce);
  const gas = 7000 * 1000;

  const txData = txObject.encodeABI();
  const txFrom =  userWallet;
  const txTo = contractAddress;
  const gasPrice = web3.utils.toWei('10', 'gwei');
  const txParams = {
    from: txFrom,
    to: txTo,
    data: txData,
    value: value,
    gas,
    nonce,
    chainId: await web3.eth.net.getId(),
    gasPrice,
  };

  return web3.eth.sendTransaction(txParams);
}

async function getPlayerFromEthereum(){
  var getDetails = await zilEthPacman.methods.getPlayer().call();
  return getDetails;
}

async function setPlayerOnEthereum(fullName, age){
  console.log("setting up player on ethereum");
  var result = "";
  var txObject = await zilEthPacman.methods.setPlayer(
      fullName,
      age
  );

  try {
   result = await sendTx(txObject);
  }catch (err){
   result = err;
  }
  return result;
}

async function setSwordonEthereum(value){
  var result = "";
  var txObject = await zilEthPacman.methods.setSword(value);

  try {
   result = await sendTx(txObject);
  }catch (err){
   result = err;
  }
  return result;
}

async function getSwordFromEthereum(){
  var getSword = await zilEthPacman.methods.getSword().call();
  return getSword;
}

async function resetEthereumContract(){
  var result = "";
  var txObject = await zilEthPacman.methods.reset();

  try {
   result = await sendTx(txObject);
  }catch (err){
   result = err;
  }
  return result;
}
