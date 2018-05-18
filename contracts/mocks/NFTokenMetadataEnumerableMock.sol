pragma solidity ^0.4.23;

import "../tokens/NFTokenMetadata.sol";
import "../tokens/NFTokenEnumerable.sol";

contract NFTokenMetadataEnumerableMock is NFTokenEnumerable, NFTokenMetadata {

  constructor(
    string _name,
    string _symbol
  )
    NFTokenMetadata(_name, _symbol)
    public
  {}

  function mint(
    address _to,
    uint256 _id,
    string _uri
  )
    onlyOwner
    external
  {
    super._mint(_to, _id);
    super._setTokenUri(_id, _uri);
  }

  function burn(
    address _owner,
    uint256 _tokenId
  )
    onlyOwner
    external
  {
    super._burn(_owner, _tokenId);
  }

  /**
   * @dev Helper function exclusively for testing the burn method.
   * @notice Remove this function and use tokenURI that has appropriate checks.
   */
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
