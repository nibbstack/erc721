pragma solidity ^0.4.24;

import "@0xcert/ethereum-utils/contracts/ownership/Ownable.sol";

/**
 * @dev Truffle migrations manager.
 */
contract Migrations is
  Ownable
{
  uint public lastCompletedMigration;

  /**
   * @dev Contract constructor.
   */
  constructor()
    public
  {
    owner = msg.sender;
  }

  /**
   * @dev Sets migration state.
   * @param _completed Last completed migration number.
   */
  function setCompleted(
    uint _completed
  )
    public
    onlyOwner()
  {
    lastCompletedMigration = _completed;
  }

  /**
   * @dev Permorms migration.
   * @param _addr New migration address.
   */
  function upgrade(
    address _addr
  )
    public
    onlyOwner()
  {
    Migrations upgraded = Migrations(_addr);
    upgraded.setCompleted(lastCompletedMigration);
  }

}
