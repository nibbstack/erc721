pragma solidity 0.5.6;

import "../../contracts/tokens/erc721-token-receiver.sol";

contract NFTokenReceiverTestMock is
  ERC721TokenReceiver
{

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
  )
    external
    returns(bytes4)
  {
    _operator;
    _from;
    _tokenId;
    _data;
    return 0x150b7a02;
  }

}
