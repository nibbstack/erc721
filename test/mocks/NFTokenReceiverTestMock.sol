pragma solidity ^0.4.24;

import "../../contracts/tokens/ERC721TokenReceiver.sol";

contract NFTokenReceiverTestMock is
  ERC721TokenReceiver
{

  function onERC721Received(
    address _from,
    uint256 _tokenId,
    bytes _data
  )
    external
    returns(bytes4)
  {
    _from;
    _tokenId;
    _data;
    return 0xf0b9e5ba;
  }

}
