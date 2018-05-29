pragma solidity ^0.4.23;

import "../tokens/NFTokenMetadata.sol";
import "../tokens/NFTokenEnumerable.sol";

contract NFTokenMetadataEnumerableMock is NFTokenEnumerable, NFTokenMetadata {

  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFTokens.
   */
  constructor(
    string _name,
    string _symbol
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
  }

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

}
