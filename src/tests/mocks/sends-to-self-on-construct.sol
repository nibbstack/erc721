// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/mocks/nf-token-mock.sol";
import "./nf-token-receiver-test-mock.sol";

contract SendsToSelfOnConstruct is
  NFTokenReceiverTestMock
{
  uint constant TOKEN_ID = 1;

  constructor()
  {
    NFTokenMock tokens = new NFTokenMock();
    tokens.mint(address(this), TOKEN_ID);
    tokens.safeTransferFrom(address(this), address(this), TOKEN_ID);
  }

}
