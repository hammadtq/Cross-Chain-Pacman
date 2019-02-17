
// These are set by the core protocol, and may vary per-chain.
// These numbers are JUST AN EXAMPLE. They will NOT WORK on the public testnet
// or mainnet. Please check what they are before proceeding, or your
// transactions will simply be rejected.
const CHAIN_ID = 333;
const MSG_VERSION = 1;
const VERSION = ZilliqaLib.bytes.pack(CHAIN_ID, MSG_VERSION);

// Populate the wallet with an account
privkey = '412cc022b2483edafe19eb98a378971669a6b80606d9b9e751870076b2da4794';

zilliqa.wallet.addByPrivateKey(
  privkey
);

const address = CP.getAddressFromPrivateKey(privkey);
console.log("Your account address is:");
console.log(`0x${address}`);

var balance = "";
var myGasPrice = "";
var contractInstance = "";

async function setZilliqa() {
  try {

    // Get Balance
    balance = await zilliqa.blockchain.getBalance(address);
    console.log(`Your account balance is:`);
    console.log(balance.result)
    myGasPrice = ZilliqaLib.units.toQa('1000', ZilliqaLib.units.Units.Li); // Gas Price that will be used by all transactions

    contractInstance = await zilliqa.contracts.at("d00a9d347e67a63d7e92667b71ed20bda5d3be49");
    // console.log(contractInstance);

  //const smartContractState = await zilliqa.blockchain.getSmartContractState("d00a9d347e67a63d7e92667b71ed20bda5d3be49");
  //console.log(smartContractState);

  } catch (err) {
    console.log(err);
  }
}

async function getStateFromZilliqa(){
  //Get the contract state
  const state = await contractInstance.getState();
  console.log("The state of the contract is:");
  console.log(state);
  return state;
}

async function setPlayerOnZilliqa(fullName, age){
  console.log("setting player on zilliqa");
  var result = "";
  try {
    const callTx = await contractInstance.call(
      "setPlayer",
      [
        {
          vname: "fullName",
          type: "String",
          value: fullName
        },
        {
          vname: "userAge",
          type: "Int32",
          value: age
        }
      ],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new ZilliqaLib.BN(0),
        gasPrice: myGasPrice,
        gasLimit: ZilliqaLib.Long.fromNumber(8000),
      }, 38, 1000, true
    );
    console.log(callTx.receipt.success);
    result = callTx;
  }catch (err){
   result = err;
  }
  return result;
}

async function setSwordOnZilliqa(value){
  console.log("setting sword on zilliqa");
  var result = "";
  try {
    const callTx = await contractInstance.call(
      "setSword",
      [
        {
          vname: "swordValue",
          type: "Int32",
          value: value
        }
      ],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new ZilliqaLib.BN(0),
        gasPrice: myGasPrice,
        gasLimit: ZilliqaLib.Long.fromNumber(8000),
      }, 38, 1000, true
    );
    console.log(callTx.receipt.success);
    result = callTx;
  }catch (err){
   result = err;
  }
  return result;
}

async function resetZilliqaContract(){
  console.log("resetting the contract");
  var result = "";
  try {
    const callTx = await contractInstance.call(
      "reset",
      [],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new ZilliqaLib.BN(0),
        gasPrice: myGasPrice,
        gasLimit: ZilliqaLib.Long.fromNumber(8000),
      }, 38, 1000, true
    );
    console.log(callTx.receipt.success);
    result = callTx;
  }catch (err){
   result = err;
  }
  return result;
}
