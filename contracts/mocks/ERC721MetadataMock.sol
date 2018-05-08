pragma solidity ^0.4.23;

import "../tokens/ERC721MetadataImplementation.sol";

contract ERC721MetadataMock is ERC721MetadataImplementation {

	constructor(string _name,
		          string _symbol)
    ERC721MetadataImplementation(_name, _symbol)
	  public
	{}

	function mint(address _to,
                uint256 _tokenId,
                string _uri)
    external
	{
		super._mint(_to, _tokenId);
		super._setTokenUri(_tokenId, _uri);
	}
}
