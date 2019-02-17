pragma solidity ^0.4.18;

contract HelloZilliqa {

   string fName;
   uint age;
   uint sword;

   event player(
       string name,
       uint age
    );

   function setPlayer(string _fName, uint _age) public {
       fName = _fName;
       age = _age;
       emit player(_fName, _age);
   }

   function getPlayer() view public returns (string, uint) {
       return (fName, age);
   }

   function setSword(uint _sword) public {
       sword = _sword;
   }

   function getSword() view public returns (uint) {
       return sword;
   }

   function reset() public {
       fName = "";
       age = 0;
       sword = 0;
   }

}
