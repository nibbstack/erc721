pragma solidity ^0.4.23;

import "../../contracts/mocks/NFTokenMetadataEnumerableMock.sol";

contract NFTokenMetadataEnumerableTestMock is NFTokenMetadataEnumerableMock {

  constructor(
    string _name,
    string _symbol
  )
    NFTokenMetadataEnumerableMock(_name, _symbol)
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
