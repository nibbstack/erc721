pragma solidity ^0.4.24;

import "../../contracts/mocks/NFTokenMetadataEnumerableMock.sol";

contract NFTokenMetadataEnumerableTestMock is
  NFTokenMetadataEnumerableMock
{

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

  function ownerToIdsLen(
    address _owner
  )
    external
    view
    returns (uint256)
  {
    return ownerToIds[_owner].length;
  }

  function ownerToIdbyIndex(
    address _owner,
    uint256 _index
  )
    external
    view
    returns (uint256)
  {
    return ownerToIds[_owner][_index];
  }

  function idToOwnerIndexWrapper(
    uint256 _tokenId
  )
    external
    view
    returns (uint256)
  {
    return idToOwnerIndex[_tokenId];
  }

  function idToIndexWrapper(
    uint256 _tokenId
  )
    external
    view
    returns (uint256)
  {
    return idToIndex[_tokenId];
  }
}
