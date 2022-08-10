// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/mocks/nf-token-metadata-enumerable-mock.sol";

contract NFTokenMetadataEnumerableTestMock is
  NFTokenMetadataEnumerableMock
{

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _maxSupply
  )
    NFTokenMetadataEnumerableMock(_name, _symbol, _maxSupply)
  {
  }

  function checkUri(
    uint256 _tokenId
  )
    external
    view
    returns (string memory)
  {
    return idToUri[_tokenId];
  }

}
