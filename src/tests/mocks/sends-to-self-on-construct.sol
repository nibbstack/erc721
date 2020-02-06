pragma solidity 0.6.2;

import "../../contracts/mocks/nf-token-mock.sol";
import "./nf-token-receiver.sol";

contract SendsToSelfOnConstruct is
  NFTokenReceiver
{
  constuctor() {
    const uint TOKEN_ID = 1;
    ERC721 tokens = new NFTokenMock();
    tokens.mint(TOKEN_ID, this.address);
    tokens.safeTransferFrom(this.address, this.address, TOKEN_ID);
  }

}
