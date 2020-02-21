![Zora: Enabling human progress](https://repository-images.githubusercontent.com/235217500/430f2080-4216-11ea-8468-de88ae01d1f8)

# Zora

Enabling human progress.

**Website:** [ourzora.com](ourzora.com)
**Twitter:** [@ourZORA](twitter.com/ourZORA)

## The token

The token contract that enables people to tokenize their time, with a maximum cap of 1000 hours that can be in circulation at any given moment.

The token is able to be minted and burned by an approved minter. The cap is immutable and cannot be changed at any point past instantiation. 

It is an ERC20 token that utilizes OpenZeppelin smart contracts.

## Contract

The token can be found in contracts/Token.sol and has the following interface:

```solidity
interface IToken {
    // ERC20
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Mint & Burn
    function mint(address account, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;

    // Pause
    function pause() external;
    function unpause() external;

    // Redeem
    function redeem(uint256 amount, bytes32 messageHash) external;
    event TokenRedeemed(address redeemer, uint256 amount, bytes32 messageHash);
}
```
