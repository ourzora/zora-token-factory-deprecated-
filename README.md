![Zora: Enabling human progress](https://repository-images.githubusercontent.com/235217500/430f2080-4216-11ea-8468-de88ae01d1f8)

# Zora

Enabling human progress.

**Website:** [ourzora.com](ourzora.com)

**Twitter:** [@ourZORA](twitter.com/ourZORA)

## The token

The token contract that enables creators to tokenize any good, artwork, time or endeavour, with a maximum cap that can be in circulation at any given moment.

The token is able to be minted and burned by an approved minter. The cap is immutable and cannot be changed at any point past instantiation. 

The tokens follow the Uniswap permit() function signature, enabling developers to pay gas for user transactions.

## Contract

The [TokenFactory](contracts/TokenFactory.sol) contract is deployed at:

* **mainnet:** [0x322af773A1395EDD762b2e10F2cD9Dd015d40BC5](https://etherscan.io/address/0x322af773a1395edd762b2e10f2cd9dd015d40bc5#writeContract)
* **ropsten:** [0x5e0075f4f5f9ebf78da12f54e32721669392097e](https://ropsten.etherscan.io/address/0x5e0075f4f5f9ebf78da12f54e32721669392097e#writeContract)
* **rinkeby:** [0x8dcF2cfadDD266b926e5C4A7c6112b0B4037bBd0](https://rinkeby.etherscan.io/address/0x8dcf2cfaddd266b926e5c4a7c6112b0b4037bbd0#writeContract)


The token can be found in [contracts/Token.sol](contracts/Token.sol) and has the following interface:

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

    // Permit (signature approvals)
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
}
```

## Deployment

```
make deploy/mainnet PRIVATE_KEY=xyz

make deploy/ropsten PRIVATE_KEY=xyz

make deploy/rinkeby PRIVATE_KEY=xyz

```

## Misc

```
make flatten | pbcopy
```


## License & Acknowledgements

MIT License.

Built by [@kern](https://github.com/kern) over two cups of tea.
