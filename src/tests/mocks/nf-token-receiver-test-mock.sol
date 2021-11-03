// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/tokens/erc721-token-receiver.sol";

contract NFTokenReceiverTestMock is
  ERC721TokenReceiver
{
  event Received();

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
  )
    external
    override
    returns(bytes4)
  {
    _operator;
    _from;
    _tokenId;
    _data;
    emit Received();
    return 0x150b7a02;
  }

}
