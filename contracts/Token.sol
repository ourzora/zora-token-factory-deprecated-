pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";

import "./IToken.sol";

contract Token is IToken, ERC20Detailed, ERC20Burnable, ERC20Mintable, ERC20Pausable {
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

    if (minter != address(0)) {
      _removeMinter(msg.sender);
      _addMinter(minter);

      _removePauser(msg.sender);
      _addPauser(minter);
    }

    _mint(minter == address(0) ? msg.sender : minter, supplyStart);
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
      _supplyCap == 0 || totalSupply().add(value) <= _supplyCap,
      "Cap exceeded"
    );

    super._mint(account, value);
  }

  /**
   * @dev Redeems a token with a message hash, burning the value.
   */
  function redeem(uint256 amount, bytes32 messageHash) public {
    require(amount > 0, "Amount must be positive");
    _burn(msg.sender, amount);
    emit TokenRedeemed(msg.sender, amount, messageHash);
  }
}
