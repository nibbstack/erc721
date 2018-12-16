pragma solidity ^0.5.1;

/**
 * @dev Math operations with safety checks that throw on error. This contract is based on the 
 * source code at: 
 * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol.
 */
library SafeMath {

  /**
   * @dev Multiplies two numbers, reverts on overflow.
   * @param factor1 Factor number.
   * @param factor2 Factor number.
   * @return The product of the two factors
   */
  function mul(
    uint256 factor1,
    uint256 factor2
  )
    internal
    pure
    returns (uint256)
  {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (factor1 == 0) {
      return 0;
    }

    uint256 product = factor1 * factor2;
    require(product / factor1 == factor2);

    return product;
  }

  /**
   * @dev Integer division of two numbers, truncating the quotient, reverts on division by zero.
   * @param dividend Dividend number.
   * @param divisor Divisor number.
   * @return The quotient
   */
  function div(
    uint256 dividend,
    uint256 divisor
  )
    internal
    pure
    returns (uint256)
  {
    // Solidity automatically asserts when dividing by 0, using all gas
    require(divisor > 0);
    uint256 quotient = dividend / divisor;
    // assert(dividend == divisor * quotient + dividend % divisor); // There is no case in which this doesn't hold

    return quotient;
  }

  /**
   * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
   * @param minuend Minuend number.
   * @param subtrahend Subtrahend number.
   * @return difference
   */
  function sub(
    uint256 minuend,
    uint256 subtrahend
  )
    internal
    pure
    returns (uint256)
  {
    require(subtrahend <= minuend);
    uint256 difference = minuend - subtrahend;

    return difference;
  }

  /**
   * @dev Adds two numbers, reverts on overflow.
   * @param addend1 Number.
   * @param addend2 Number.
   * @return sum
   */
  function add(
    uint256 addend1,
    uint256 addend2
  )
    internal
    pure
    returns (uint256)
  {
    uint256 sum = addend1 + addend2;
    require(sum >= addend1);

    return sum;
  }

  /**
    * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    * @param dividend Number.
    * @param divisor Number.
    * @return remainder
    */
  function mod(
    uint256 dividend,
    uint256 divisor
  )
    internal
    pure
    returns (uint256) 
  {
    require(divisor != 0);
    return dividend % divisor;
  }
}
