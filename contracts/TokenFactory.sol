pragma solidity ^0.5.1;

import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AionToken.sol";

contract TokenFactory {

    mapping (string => IAionToken) tokens;

    function createToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        address owner,
        uint256 supplyStart,
        uint32 supplyMax
    ) public returns (IAionToken) {
        require(
            tokens[symbol] != IAionToken(0),
            "Token symbol already taken"
        );

        IAionToken newToken = new AionToken(
            name,
            symbol,
            decimals,
            owner,
            supplyStart,
            supplyMax
        );
        tokens[symbol] = newToken;

        return newToken;
    }

}
