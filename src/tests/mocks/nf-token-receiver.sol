pragma solidity 0.6.2;

import "../../contracts/mocks/erc721-token-receiver.sol";

contract NFTokenReceiver is
  ERC721TokenReceiver
{
  event Received();

  function onERC721Received(
    address,
    address,
    uint256,
    bytes calldata
  )
    external
    returns(bytes4)
  {
    emit Received();
    return 0x150b7a02;
  }

}
