pragma solidity ^0.4.23;

import "../tokens/NFTokenEnumerable.sol";

contract NFTokenEnumerableMock is NFTokenEnumerable {

  function mint(
    address _to,
    uint256 _id
  )
    external
  {
    super._mint(_to, _id);
  }

  function burn(
    address _owner,
    uint256 _tokenId
  )
    external
  {
    super._burn(_owner, _tokenId);
  }
}
