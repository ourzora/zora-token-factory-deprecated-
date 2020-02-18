pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

import "./IAionToken.sol";

contract AionToken is IAionToken, ERC20Detailed, ERC20Burnable, ERC20Capped {

  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    address minter,
    uint256 supplyStart,
    uint256 supplyMax
  )
  ERC20Detailed(name, symbol, decimals) 
  ERC20Capped(supplyMax)
  public {
    _addMinter(minter);
    _mint(minter, supplyStart);
  }

}
