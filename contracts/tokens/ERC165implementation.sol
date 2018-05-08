pragma solidity ^0.4.23;

import "./ERC165.sol";

/*
 * @title EIP165 implementation.
 * @dev Reusable implementation.
 */
contract ERC165implementation is ERC165 {
  /*
   * @dev Mapping of supported intefraces.
   * You must not set element 0xffffffff to true.
   */
  mapping(bytes4 => bool) internal supportedInterfaces;

  constructor()
    public
  {
      supportedInterfaces[0x01ffc9a7] = true; // ERC165
  }

  /*
   * @dev Function to check which interfaces are suported by this contract.
   * @param interfaceID If of the interface.
   */
  function supportsInterface(bytes4 interfaceID)
    external
    view
    returns (bool)
  {
    return supportedInterfaces[interfaceID];
  }
}