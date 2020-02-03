pragma solidity 0.6.2;

import "../../contracts/mocks/nf-token-metadata-mock.sol";

contract NFTokenMetadataTestMock is
  NFTokenMetadataMock
{

  constructor(
    string memory _name,
    string memory _symbol
  )
    public
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
