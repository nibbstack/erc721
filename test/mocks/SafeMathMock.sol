pragma solidity ^0.4.19;

import "../../contracts/math/SafeMath.sol";

contract SafeMathMock {
  uint256 public result;

  function multiply(
    uint256 _a,
    uint256 _b
  )
    public
  {
    result = SafeMath.mul(_a, _b);
  }

  function subtract(
    uint256 _a,
    uint256 _b
  )
    public
  {
    result = SafeMath.sub(_a, _b);
  }

  function add(
    uint256 _a,
    uint256 _b
  )
    public
  {
    result = SafeMath.add(_a, _b);
  }

}
