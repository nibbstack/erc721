pragma solidity ^0.4.23;

import "../tokens/NFToken.sol";

contract NFTokenMock is NFToken {

  function mint(
    address _to,
    uint256 _id
  )
    onlyOwner
    external
  {
    super._mint(_to, _id);
  }

  function burn(
    address _owner,
    uint256 _tokenId
  )
    onlyOwner
    external
  {
    super._burn(_owner, _tokenId);
  }

}
