pragma solidity ^0.5.1;

// import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

contract TokenFactory {

    function createToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        address minter,
        uint256 supplyStart,
        uint256 supplyCap
    ) public returns (IToken) {
        IToken newToken = new Token(
            name,
            symbol,
            decimals,
            minter,
            supplyStart,
            supplyCap
        );

        return newToken;
    }

}
