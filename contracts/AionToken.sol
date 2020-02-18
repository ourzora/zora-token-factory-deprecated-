pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

import "./IAionToken.sol";

contract AionToken is IAionToken, ERC20Detailed, ERC20Burnable, ERC20Mintable {
  uint256 private _supplyCap;

  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    address minter,
    uint256 supplyStart,
    uint256 supplyCap
  )
  ERC20Detailed(name, symbol, decimals) 
  public {
    _supplyCap = supplyCap;
    _addMinter(minter);
    _mint(minter, supplyStart);
  }

  /**
   * @dev Returns the cap on the token's total supply.
   */
  function cap() public view returns (uint256) {
    return _supplyCap;
  }

  /**
   * @dev See {ERC20Mintable-mint}.
   *
   * Requirements:
   *
   * - `value` must not cause the total supply to go over the cap.
   */
  function _mint(address account, uint256 value) internal {
    require(
      _supplyCap != 0 && totalSupply().add(value) <= _supplyCap,
      "Cap exceeded"
    );

    super._mint(account, value);
  }

}
