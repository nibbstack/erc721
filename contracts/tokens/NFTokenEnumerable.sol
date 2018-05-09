pragma solidity ^0.4.23;

import "./NFToken.sol";
import "./ERC721Enumerable.sol";

/*
 * @title None-fungable token.
 * @dev Xcert is an implementation of EIP721 and EIP721Metadata. This contract follows
 * the implementation at goo.gl/FLaJc9.
 */
contract NFTokenEnumerable is NFToken, ERC721Enumerable {

  /*
   * @dev Array with all NFToken IDs.
   */
  uint256[] internal tokens;

  /*
   * @dev Mapping from NFToken ID to position in the tokens array.
   */
  mapping(uint256 => uint256) internal idToIndex;

  /*
   * @dev Mapping from owner to list of owned NFToken IDs.
   */
  mapping (address => uint256[]) internal ownerToIds;

  /*
   * @dev Mapping from NFToken id to index of the owner tokens list
   */
  mapping(uint256 => uint256) internal idToOwnerIndex;

  /*
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFTokens.
   */
  constructor()
    NFToken()
    public
  {
    supportedInterfaces[0x780e9d63] = true; // ERC721Enumerable
  }

  /*
   * @dev Mints a new NFToken.
   * @param _to The address that will own the minted NFToken.
   * @param _id of the NFToken to be minted by the msg.sender.
   */
  function _mint(address _to,
                 uint256 _id)
    internal
  {
    super._mint(_to, _id);

    idToIndex[_id] = tokens.length;
    tokens.push(_id);
  }

  /*
   * @dev Burns a NFToken.
   * @param _owner Address of the NFToken owner.
   * @param _tokenId ID of the NFToken to be burned.
   */
  function _burn(address _owner,
                 uint256 _tokenId)
    internal
  {
    super._burn(_owner, _tokenId);

    uint256 tokenIndex = idToIndex[_tokenId];
    uint256 lastTokenIndex = tokens.length.sub(1);
    uint256 lastToken = tokens[lastTokenIndex];

    tokens[tokenIndex] = lastToken;
    tokens[lastTokenIndex] = 0;

    tokens.length--;
    idToIndex[_tokenId] = 0;
    idToIndex[lastToken] = tokenIndex;
  }

  /*
   * @dev Removes a NFToken from owner.
   * @param _from Address from wich we want to remove the NFToken.
   * @param _tokenId Which NFToken we want to remove.
   */
  function removeNFToken(address _from,
                         uint256 _tokenId)
   internal
  {
    super.removeNFToken(_from, _tokenId);

    uint256 tokenIndex = idToOwnerIndex[_tokenId];
    uint256 lastTokenIndex = ownerToIds[_from].length.sub(1);
    uint256 lastToken = ownerToIds[_from][lastTokenIndex];

    ownerToIds[_from][tokenIndex] = lastToken;
    ownerToIds[_from][lastTokenIndex] = 0;
    // Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
    // be zero. Then we can make sure that we will remove _tokenId from the ownedTokens list since we are first swapping
    // the lastToken to the first position, and then dropping the element placed in the last position of the list

    ownerToIds[_from].length--;
    idToOwnerIndex[_tokenId] = 0;
    idToOwnerIndex[lastToken] = tokenIndex;
  }

  /*
   * @dev Assignes a new NFToken to owner.
   * @param _To Address to wich we want to add the NFToken.
   * @param _tokenId Which NFToken we want to add.
   */
  function addNFToken(address _to,
                      uint256 _tokenId)
    internal
  {
    super.addNFToken(_to, _tokenId);

    uint256 length = ownerToIds[_to].length;
    ownerToIds[_to].push(_tokenId);
    idToOwnerIndex[_tokenId] = length;
  }

  /*
   * @dev Returns the count of all existing NFTokens.
   */
  function totalSupply()
    external
    view
    returns (uint256)
  {
    return tokens.length;
  }

  /*
   * @dev Returns NFToken ID by its index.
   */
  function tokenByIndex(uint256 _index)
    external
    view
    returns (uint256)
  {
    require(_index < tokens.length);
    return tokens[_index];
  }

  /*
   * @dev returns the `_index`th NFToken id of `_owner`.
   */
  function tokenOfOwnerByIndex(address _owner,
                               uint256 _index)
    external
    view
    returns (uint256)
  {
    require(_index < ownerToIds[_owner].length);
    return ownerToIds[_owner][_index];
  }
}
