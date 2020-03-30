pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";

import "./IToken.sol";

contract Token is IToken, ERC20Detailed, ERC20Burnable, ERC20Mintable, ERC20Pausable {
  uint256 private _supplyCap;

  /**
   * @dev Permit using EIP712
   */
  // bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address holder,address spender,uint256 nonce,uint256 expiry,bool allowed)");
  bytes32 public constant PERMIT_TYPEHASH = 0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb;
  string public constant VERSION = "1";
  bytes32 public DOMAIN_SEPARATOR;
  mapping (address => uint256) public permitNonces;

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
    initDomainSeparator(name);

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
   * @dev Initializes EIP712 DOMAIN_SEPARATOR based on the current contract and chain ID.
   */
  function initDomainSeparator(string memory name) private {
    uint256 chainID;
    assembly {
        chainID := chainid()
    }

    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak256(bytes(name)),
        keccak256(bytes(VERSION)),
        chainID,
        address(this)
      )
    );
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

  /**
   * @dev Approve by signature.
   *
   * Adapted from MakerDAO's Dai contract:
   * https://github.com/makerdao/dss/blob/master/src/dai.sol
   */
  function permit(
    address holder,
    address spender,
    uint256 nonce,
    uint256 expiry,
    bool allowed,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external {
    bytes32 digest =
      keccak256(
        abi.encodePacked(
          "\x19\x01",
          DOMAIN_SEPARATOR,
          keccak256(
            abi.encode(
              PERMIT_TYPEHASH,
              holder,
              spender,
              nonce,
              expiry,
              allowed
            )
          )
        )
      );

    require(holder == ecrecover(digest, v, r, s), "Signature invalid");
    require(expiry == 0 || now <= expiry, "Permit expired");
    require(nonce == permitNonces[holder]++, "Invalid nonce");

    uint amount = allowed ? uint256(-1) : 0;
    _approve(holder, spender, amount);
  }
}
