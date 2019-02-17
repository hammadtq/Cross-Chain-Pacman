const { Transaction } = require('@zilliqa-js/account');
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const CP = require ('@zilliqa-js/crypto');

const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

// These are set by the core protocol, and may vary per-chain.
// These numbers are JUST AN EXAMPLE. They will NOT WORK on the public testnet
// or mainnet. Please check what they are before proceeding, or your
// transactions will simply be rejected.
const CHAIN_ID = 333;
const MSG_VERSION = 1;
const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);

// Populate the wallet with an account
privkey = '412cc022b2483edafe19eb98a378971669a6b80606d9b9e751870076b2da4794';

zilliqa.wallet.addByPrivateKey(
  privkey
);

const address = CP.getAddressFromPrivateKey(privkey);
console.log("Your account address is:");
console.log(`0x${address}`);

async function testBlockchain() {
  try {

    // Get Balance
    const balance = await zilliqa.blockchain.getBalance(address);
    console.log(`Your account balance is:`);
    console.log(balance.result)
    const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions

    // Deploy a contract
    const code = `scilla_version 0

    (* HelloEthereum contract *)

    import ListUtils

    (***************************************************)
    (*               Associated library                *)
    (***************************************************)
    library HelloWorld


    (***************************************************)
    (*             The contract definition             *)
    (***************************************************)

    contract HelloEthereum
    (owner: ByStr20)

    field fName : String = ""
    field age : Int32 = Int32 0
    field sword : Int32 = Int32 0

    transition setPlayer (fullName : String, userAge : Int32)
      fName := fullName;
      age := userAge;
      e = {_eventname : "setPlayer()"};
      event e
    end

    transition getPlayer ()
        r <- fName;
        e = {_eventname: "getPlayer()"; msg: r};
        event e
    end

    transition setSword (swordValue : Int32)
      sword := swordValue;
      e = {_eventname : "setSword()"};
      event e
    end

    transition getSword ()
        r <- sword;
        e = {_eventname: "getSword()"; msg: r};
        event e
    end

    transition reset ()
        temp_fname = "";
        temp_age = Int32 0;
        temp_sword = Int32 0;
        fName := temp_fname;
        age := temp_age;
        sword := temp_sword;
        e = {_eventname: "reset()"};
        event e
    end
`;

    const init = [
      // this parameter is mandatory for all init arrays
      {
        vname: "_scilla_version",
        type: "Uint32",
        value: "0"
      },
      {
        vname: "owner",
        type: "ByStr20",
        // NOTE: all byte strings passed to Scilla contracts _must_ be
        // prefixed with 0x. Failure to do so will result in the network
        // rejecting the transaction while consuming gas!
        value: `0x${address}`
      }
    ];

    // Instance of class Contract
    const contract = zilliqa.contracts.new(code, init);

    //Deploy the contract
    const [deployTx, hello] = await contract.deploy({
      version: VERSION,
      gasPrice: myGasPrice,
      gasLimit: Long.fromNumber(10000)
    }, 38, 1000, true);

    //Introspect the state of the underlying transaction
    console.log(`Deployment Transaction ID: ${deployTx.id}`);
    console.log(`Deployment Transaction Receipt:`);
    console.log(deployTx.txParams.receipt);

    //Get the deployed contract address
    console.log("The contract address is:");
    console.log(hello.address);
    const callTx = await hello.call(
      "setPlayer",
      [
        {
          vname: "fullName",
          type: "String",
          value: "Hammad"
        },
        {
          vname: "userAge",
          type: "Int32",
          value: "35"
        }
      ],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new BN(0),
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(8000),
      }, 38, 1000, true
    );
    console.log(callTx);

    //Get the contract state
    const state = await hello.getState();
    console.log("The state of the contract is:");
    console.log(state);

//   const smartContractState = await zilliqa.blockchain.getSmartContractState("aded52d3092c065ced6c2c0de0e102a135e996fa");
// console.log(smartContractState);

  } catch (err) {
    console.log(err);
  }
}

testBlockchain();
