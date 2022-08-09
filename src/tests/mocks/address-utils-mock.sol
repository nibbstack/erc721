// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
