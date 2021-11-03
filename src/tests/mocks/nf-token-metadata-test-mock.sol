// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/mocks/nf-token-metadata-mock.sol";

contract NFTokenMetadataTestMock is
  NFTokenMetadataMock
{

  constructor(
    string memory _name,
    string memory _symbol
  )
    NFTokenMetadataMock(_name, _symbol)
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
