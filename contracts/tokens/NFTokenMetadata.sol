pragma solidity ^0.4.23;

import "./NFToken.sol";
import "./ERC721Metadata.sol";

/*
 * @dev Optional metadata implementation for ERC-721 non-fungible token standard.
 */
contract NFTokenMetadata is NFToken, ERC721Metadata {

  /*
   * @dev A descriptive name for a collection of NFTs.
   */
  string private nftName;

  /*
   * @dev An abbreviated name for NFTokens.
   */
  string private nftSymbol;

  /*
   * @dev Mapping from NFToken ID to metadata uri.
   */
  mapping (uint256 => string) internal idToUri;

  /*
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
    supportedInterfaces[0x5b5e139f] = true; // ERC721Metadata
  }

    /*
   * @dev Burns a NFToken.
   * @notice This is a private function which should be called from user-implemented external
   * burner. Its purpose is to show and properly initialize data structures when using this
   * implementation.
   * @param _owner Address of the NFToken owner.
   * @param _tokenId ID of the NFToken to be burned.
   */
  function _burn(
    address _owner,
    uint256 _tokenId
  )
    internal
  {
    super._burn(_owner, _tokenId);

    if (bytes(idToUri[_tokenId]).length != 0) {
      delete idToUri[_tokenId];
    }
  }

  /*
   * @dev Set a distinct URI (RFC 3986) for a given NFToken ID.
   * @param _tokenId Id for which we want uri.
   * @param _uri String representing RFC 3986 URI.
   */
  function _setTokenUri(
    uint256 _tokenId,
    string _uri
  )
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
    _name = nftName;
  }

  /*
  * @dev Returns an abbreviated name for NFTokens.
  */
  function symbol()
    external
    view
    returns (string _symbol)
  {
    _symbol = nftSymbol;
  }

  /*
   * @dev A distinct URI (RFC 3986) for a given NFToken.
   * @param _tokenId Id for which we want uri.
   */
  function tokenURI(
    uint256 _tokenId
  )
    validNFToken(_tokenId)
    external
    view
    returns (string)
  {
    return idToUri[_tokenId];
  }
}
