pragma solidity ^0.4.23;

import "../tokens/NFTokenMetadata.sol";

contract NFTokenMetadataMock is NFTokenMetadata {

	constructor(string _name,
		          string _symbol)
    NFTokenMetadata(_name, _symbol)
	  public
	{}

	function mint(address _to,
                uint256 _id,
                string _uri)
    external
	{
		super._mint(_to, _id);
		super._setTokenUri(_id, _uri);
	}
}