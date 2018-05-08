pragma solidity ^0.4.23;

import "../tokens/ERC721implementation.sol";

contract ERC721Mock is ERC721implementation {

	function mint(address _to,
                  uint256 _id)
      external
	{
		super._mint(_to, _id);
	}
}