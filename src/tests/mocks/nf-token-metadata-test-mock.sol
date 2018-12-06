pragma solidity ^0.4.24;

import "../../contracts/mocks/nf-token-metadata-mock.sol";

contract NFTokenMetadataTestMock is
  NFTokenMetadataMock
{
  constructor(
    string _name,
    string _symbol
  )
    NFTokenMetadataMock(_name, _symbol)
    public
  {}

  function checkUri(
    uint256 _tokenId
  )
    external
    view
    returns (string)
  {
    return idToUri[_tokenId];
  }
}
