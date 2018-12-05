pragma solidity ^0.4.24;

/**
 * @dev Math operations with safety checks that throw on error. This contract is based on the 
 * source code at: 
 * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol.
 */
library SafeMath {

  /**
   * @dev Multiplies two numbers, reverts on overflow.
   * @param _a Factor number.
   * @param _b Factor number.
   */
  function mul(
    uint256 _a,
    uint256 _b
  )
    internal
    pure
    returns (uint256)
  {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    uint256 c = _a * _b;
    require(c / _a == _b);

    return c;
  }

  /**
   * @dev Integer division of two numbers, truncating the quotient, reverts on division by zero.
   * @param _a Dividend number.
   * @param _b Divisor number.
   */
  function div(
    uint256 _a,
    uint256 _b
  )
    internal
    pure
    returns (uint256)
  {
    // Solidity only automatically asserts when dividing by 0
    require(_b > 0);
    uint256 c = _a / _b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
   * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
   * @param _a Minuend number.
   * @param _b Subtrahend number.
   */
  function sub(
    uint256 _a,
    uint256 _b
  )
    internal
    pure
    returns (uint256)
  {
    require(_b <= _a);
    uint256 c = _a - _b;

    return c;
  }

  /**
   * @dev Adds two numbers, reverts on overflow.
   * @param _a Number.
   * @param _b Number.
   */
  function add(
    uint256 _a,
    uint256 _b
  )
    internal
    pure
    returns (uint256)
  {
    uint256 c = _a + _b;
    require(c >= _a);

    return c;
  }

  /**
    * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    * @param _a Number.
    * @param _b Number.
    */
  function mod(
    uint256 _a,
    uint256 _b
  )
    internal
    pure
    returns (uint256) 
  {
    require(_b != 0);
    return _a % _b;
  }
}
