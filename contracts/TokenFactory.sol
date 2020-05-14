pragma solidity ^0.5.1;

// import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

contract TokenFactory {
    address[] public tokens;

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
        tokens.push(address(newToken));

        return newToken;
    }
    
    function getTokenCount() public view returns (uint256 TokenCount) {
        return tokens.length;
    }
}
