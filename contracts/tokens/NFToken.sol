pragma solidity ^0.4.23;

import "../math/SafeMath.sol";
import "../ownership/Ownable.sol";
import "./ERC721.sol";
import "./SupportsInterface.sol";
import "./ERC721TokenReceiver.sol";
import "../utils/AddressUtils.sol";

/*
 * @dev Xcert is an implementation of EIP721 and EIP721Metadata. This contract follows the
 * implementation at goo.gl/FLaJc9.
 */
contract NFToken is Ownable, ERC721, SupportsInterface {
  using SafeMath for uint256;
  using AddressUtils for address;

  /*
   * @dev A mapping from NFToken ID to the address that owns it.
   */
  mapping (uint256 => address) internal idToOwner;

  /*
   * @dev Mapping from NFToken ID to approved address.
   */
  mapping (uint256 => address) internal idToApprovals;

   /*
   * @dev Mapping from owner address to count of his tokens.
   */
  mapping (address => uint256) internal ownerToNFTokenCount;

  /*
   * @dev Mapping from owner address to mapping of operator addresses.
   */
  mapping (address => mapping (address => bool)) internal ownerToOperators;

  /*
   * @dev Magic value of a smart contract that can recieve NFToken.
   * Equal to: keccak256("onERC721Received(address,uint256,bytes)").
   */
  bytes4 constant MAGIC_ON_ERC721_RECEIVED = 0xf0b9e5ba;

  /**
   * @dev Emits when ownership of any NFT changes by any mechanism. This event emits when NFTs are
   * created (`from` == 0) and destroyed (`to` == 0). Exception: during contract creation, any
   * number of NFTs may be created and assigned without emitting Transfer. At the time of any
   * transfer, the approved address for that NFT (if any) is reset to none.
   */
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _tokenId
  );

  /*
   * @dev This emits when the approved address for an NFT is changed or reaffirmed. The zero
   * address indicates there is no approved address. When a Transfer event emits, this also
   * indicates that the approved address for that NFT (if any) is reset to none.
   */
  event Approval(
    address indexed _owner,
    address indexed _approved,
    uint256 _tokenId
  );

  /*
   * @dev This emits when an operator is enabled or disabled for an owner. The operator can manage
   * all NFTs of the owner.
   */
  event ApprovalForAll(
    address indexed _owner,
    address indexed _operator,
    bool _approved
  );

  /*
   * @dev Guarantees that the msg.sender is an owner or operator of the given NFToken.
   * @param _tokenId ID of the NFToken to validate.
   */
  modifier canOperate(
    uint256 _tokenId
  ) {
    address tokenOwner = idToOwner[_tokenId];
    require(tokenOwner == msg.sender || ownerToOperators[tokenOwner][msg.sender]);
    _;
  }

  /*
   * @dev Guarantees that the msg.sender is allowed to transfer NFToken.
   * @param _tokenId ID of the NFToken to transfer.
   */
  modifier canTransfer(
    uint256 _tokenId
  ) {
    address tokenOwner = idToOwner[_tokenId];
    require(
      tokenOwner == msg.sender
      || getApproved(_tokenId) == msg.sender
      || ownerToOperators[tokenOwner][msg.sender]
    );

    _;
  }

  /*
   * @dev Guarantees that _tokenId is a valid Token.
   * @param _tokenId ID of the NFToken to validate.
   */
  modifier validNFToken(
    uint256 _tokenId
  ) {
    require(idToOwner[_tokenId] != address(0));
    _;
  }

  /*
   * @dev Contract constructor.
   */
  constructor()
    SupportsInterface()
    public
  {
    supportedInterfaces[0x80ac58cd] = true; // ERC721
  }

  /*
   * @dev Returns the number of NFTs owned by `_owner`. NFTs assigned to the zero address are
   * considered invalid, and this function throws for queries about the zero address.
   * @param _owner Address for whom to query the balance.
   */
  function balanceOf(
    address _owner
  )
    external
    view
    returns (uint256)
  {
    require(_owner != address(0));
    return ownerToNFTokenCount[_owner];
  }

  /*
   * @dev Returns the address of the owner of the NFT. NFTs assigned to zero address are considered
   * invalid, and queries about them do throw.
   * @param _tokenId The identifier for an NFT.
   */
  function ownerOf(
    uint256 _tokenId
  )
    external
    view
    returns (address _owner)
  {
    _owner = idToOwner[_tokenId];
    require(_owner != address(0));
  }

  /*
   * @dev Transfers the ownership of an NFT from one address to another address.
   * @notice Throws unless `msg.sender` is the current owner, an authorized operator, or the
   * approved address for this NFT. Throws if `_from` is not the current owner. Throws if `_to` is
   * the zero address. Throws if `_tokenId` is not a valid NFT. When transfer is complete, this
   * function checks if `_to` is a smart contract (code size > 0). If so, it calls `onERC721Received`
   * on `_to` and throws if the return value is not `bytes4(keccak256("onERC721Received(address,uint256,bytes)"))`.
   * @param _from The current owner of the NFT.
   * @param _to The new owner.
   * @param _tokenId The NFT to transfer.
   * @param _data Additional data with no specified format, sent in call to `_to`.
   */
  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId,
    bytes _data
  )
    external
  {
    _safeTransferFrom(_from, _to, _tokenId, _data);
  }

  /*
   * @dev Transfers the ownership of an NFT from one address to another address.
   * @notice This works identically to the other function with an extra data parameter, except this
   * function just sets data to ""
   * @param _from The current owner of the NFT.
   * @param _to The new owner.
   * @param _tokenId The NFT to transfer.
   */
  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
    external
  {
    _safeTransferFrom(_from, _to, _tokenId, "");
  }

  /**
   * @dev Throws unless `msg.sender` is the current owner, an authorized operator, or the approved
   * address for this NFT. Throws if `_from` is not the current owner. Throws if `_to` is the zero
   * address. Throws if `_tokenId` is not a valid NFT.
   * @notice The caller is responsible to confirm that `_to` is capable of receiving NFTs or else
   * they mayb be permanently lost.
   * @param _from The current owner of the NFT.
   * @param _to The new owner.
   * @param _tokenId The NFT to transfer.
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
    external
    canTransfer(_tokenId)
    validNFToken(_tokenId)
  {
    address tokenOwner = idToOwner[_tokenId];
    require(tokenOwner == _from);
    require(_to != address(0));

    _transfer(_to, _tokenId);
  }

  /*
   * @dev Set or reaffirm the approved address for an NFT.
   * @notice The zero address indicates there is no approved address. Throws unless `msg.sender` is
   * the current NFT owner, or an authorized operator of the current owner.
   * @param _to Address to be approved for the given NFToken ID.
   * @param _tokenId ID of the token to be approved.
   */
  function approve(
    address _approved,
    uint256 _tokenId
  )
    external
    canOperate(_tokenId)
    validNFToken(_tokenId)
  {
    address tokenOwner = idToOwner[_tokenId];
    require(_approved != tokenOwner);
    require(!(getApproved(_tokenId) == address(0) && _approved == address(0)));

    idToApprovals[_tokenId] = _approved;
    emit Approval(tokenOwner, _approved, _tokenId);
  }

  /**
   * @dev Enables or disables approval for a third party ("operator") to manage all of
   * `msg.sender`'s assets. It also emits the ApprovalForAll event.
   * @notice This works even if sender doesn't own any tokens at the time.
   * @param _operator Address to add to the set of authorized operators.
   * @param _approved True if the operators is approved, false to revoke approval.
   */
  function setApprovalForAll(
    address _operator,
    bool _approved
  )
    external
  {
    require(_operator != address(0));
    ownerToOperators[msg.sender][_operator] = _approved;
    emit ApprovalForAll(msg.sender, _operator, _approved);
  }

  /*
   * @dev Get the approved address for a single NFT.
   * @notice Throws if `_tokenId` is not a valid NFT.
   * @param _tokenId ID of the NFToken to query the approval of.
   */
  function getApproved(
    uint256 _tokenId
  )
    public
    view
    validNFToken(_tokenId)
    returns (address)
  {
    return idToApprovals[_tokenId];
  }

  /**
   * @dev Returns true if `_operator` is an approved operator for `_owner`, false otherwise.
   * @param _owner The address that owns the NFTs.
   * @param _operator The address that acts on behalf of the owner.
   */
  function isApprovedForAll(
    address _owner,
    address _operator
  )
    external
    view
    returns (bool)
  {
    require(_owner != address(0));
    require(_operator != address(0));
    return ownerToOperators[_owner][_operator];
  }

  /*
   * @dev Actually perform the safeTransferFrom.
   * @param _from The current owner of the NFT.
   * @param _to The new owner.
   * @param _tokenId The NFT to transfer.
   * @param _data Additional data with no specified format, sent in call to `_to`.
   */
  function _safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId,
    bytes _data
  )
    internal
    canTransfer(_tokenId)
    validNFToken(_tokenId)
  {
    address tokenOwner = idToOwner[_tokenId];
    require(tokenOwner == _from);
    require(_to != address(0));

    _transfer(_to, _tokenId);

    if (_to.isContract()) {
      bytes4 retval = ERC721TokenReceiver(_to).onERC721Received(_from, _tokenId, _data);
      require(retval == MAGIC_ON_ERC721_RECEIVED);
    }
  }

  /*
   * @dev Actually preforms the transfer. Does NO checks.
   * @param _to Address of a new owner.
   * @param _tokenId The NFToken that is being transferred.
   */
  function _transfer(
    address _to,
    uint256 _tokenId
  )
    private
  {
    address from = idToOwner[_tokenId];

    clearApproval(from, _tokenId);
    removeNFToken(from, _tokenId);
    addNFToken(_to, _tokenId);

    emit Transfer(from, _to, _tokenId);
  }

  /*
   * @dev Mints a new NFToken.
   * @notice This is a private function which should be called from user-implemented external
   * minter. Its purpose is to show and properly initialize data structures when using this
   * implementation.
   * @param _to The address that will own the minted NFToken.
   * @param _tokenId of the NFToken to be minted by the msg.sender.
   */
  function _mint(
    address _to,
    uint256 _tokenId
  )
    internal
  {
    require(_to != address(0));
    require(_tokenId != 0);
    require(idToOwner[_tokenId] == address(0));

    addNFToken(_to, _tokenId);

    emit Transfer(address(0), _to, _tokenId);
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
    validNFToken(_tokenId)
    internal
  {
    clearApproval(_owner, _tokenId);
    removeNFToken(_owner, _tokenId);
    emit Transfer(_owner, address(0), _tokenId);
  }

  /*
   * @dev Clears the current approval of a given NFToken ID.
   * @param _tokenId ID of the NFToken to be transferred.
   */
  function clearApproval(
    address _owner,
    uint256 _tokenId
  )
    internal
  {
    delete idToApprovals[_tokenId];
    emit Approval(_owner, 0, _tokenId);
  }

  /*
   * @dev Removes a NFToken from owner.
   * @param _from Address from wich we want to remove the NFToken.
   * @param _tokenId Which NFToken we want to remove.
   */
  function removeNFToken(
    address _from,
    uint256 _tokenId
  )
   internal
  {
    require(idToOwner[_tokenId] == _from);
    assert(ownerToNFTokenCount[_from] > 0);
    ownerToNFTokenCount[_from] = ownerToNFTokenCount[_from].sub(1);
    delete idToOwner[_tokenId];
  }

  /*
   * @dev Assignes a new NFToken to owner.
   * @param _To Address to wich we want to add the NFToken.
   * @param _tokenId Which NFToken we want to add.
   */
  function addNFToken(
    address _to,
    uint256 _tokenId
  )
    internal
  {
    require(idToOwner[_tokenId] == address(0));

    idToOwner[_tokenId] = _to;
    ownerToNFTokenCount[_to] = ownerToNFTokenCount[_to].add(1);
  }

}
