pragma solidity ^0.4.23;

import "../tokens/ERC721EnumerableImplementation.sol";

contract ERC721EnumerableMock is ERC721EnumerableImplementation {

	function mint(address _to,
                uint256 _tokenId)
      external
	{
		super._mint(_to, _tokenId);
	}
}
