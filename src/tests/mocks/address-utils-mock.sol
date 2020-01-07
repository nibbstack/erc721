pragma solidity 0.6.1;

import "../../contracts/utils/address-utils.sol";

contract AddressUtilsMock {
  using AddressUtils for address;

  function isContract(
    address _addr
  )
    external
    view
    returns (bool addressCheck)
  {
    addressCheck = _addr.isContract();
  }
}
