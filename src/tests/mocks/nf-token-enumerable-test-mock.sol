pragma solidity ^0.4.24;

import "../../contracts/mocks/nf-token-enumerable-mock.sol";

contract NFTokenEnumerableTestMock is
  NFTokenEnumerableMock
{
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

  function removeNFTokenWrapper(
    address _from,
    uint256 _tokenId
  )
   external
  {
    super.removeNFToken(_from, _tokenId);
  }

  function addNFTokenWrapper(
    address _to,
    uint256 _tokenId
  )
    external
  {
    super.addNFToken(_to, _tokenId);
  }
}
