pragma solidity ^0.4.23;

import "../../contracts/mocks/NFTokenMetadataMock.sol";

contract NFTokenMetadataTestMock is NFTokenMetadataMock {

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
