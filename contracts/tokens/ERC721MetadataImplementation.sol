pragma solidity ^0.4.23;

import "./ERC721implementation.sol";
import "./ERC721Metadata.sol";

/*
 * @title ERC721 metadata extension implementation.
 * @dev Reusable implementation.
 */
contract ERC721MetadataImplementation is ERC721implementation {

  /*
   * @dev A descriptive name for a collection of NFTs.
   */
  string private issuerName;

  /*
   * @dev An abbreviated name for NFTokens.
   */
  string private issuerSymbol;

  /*
   * @dev Mapping from NFToken ID to metadata uri.
   */
  mapping (uint256 => string) internal idToUri;

  /*
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFTokens.
   */
  constructor(string _name,
              string _symbol)
    ERC721implementation()
    public
  {
    issuerName = _name;
    issuerSymbol = _symbol;
    supportedInterfaces[0x5b5e139f] = true; // ERC721Metadata
  }

  /*
   * @dev Set a distinct URI (RFC 3986) for a given NFToken ID.
   * @param _tokenId Id for which we want uri.
   * @param _uri String representing RFC 3986 URI.
   */
  function _setTokenUri(uint256 _tokenId,
                       string _uri)
    validNFToken(_tokenId)
    internal
  {
    idToUri[_tokenId] = _uri;
  }

  /*
   * @dev Returns a descriptive name for a collection of NFTokens.
   */
  function name()
    external
    view
    returns (string _name)
  {
    _name = issuerName;
  }

  /*
  * @notice Returns an abbreviated name for NFTokens.
  */
  function symbol()
    external
    view
    returns (string _symbol)
  {
    _symbol = issuerSymbol;
  }

  /*
   * @dev A distinct URI (RFC 3986) for a given NFToken.
   * @param _tokenId Id for which we want uri.
   */
  function tokenURI(uint256 _tokenId)
    validNFToken(_tokenId)
    external
    view
    returns (string)
  {
    return idToUri[_tokenId];
  }
}
