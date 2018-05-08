const Ownable = artifacts.require('Ownable');
const assertRevert = require('../helpers/assertRevert');

contract('ownership/Ownable', (accounts) => {
  let ownable;

  beforeEach(async () => {
    ownable = await Ownable.new();
  });

  it('has an owner', async () => {
    const owner = await ownable.owner();
    assert.isTrue(owner !== 0);
  });

  it('changes owner after transfer', async () => {
    let other = accounts[1];
    await ownable.transferOwnership(other);
    let owner = await ownable.owner();
    assert.isTrue(owner === other);
  });

  it('prevents non-owners from transfering', async () => {
    const other = accounts[2];
    const owner = await ownable.owner.call();
    assert.isTrue(owner !== other);
    await assertRevert(ownable.transferOwnership(other, { from: other }));
  });

  it('guards ownership against stuck state', async () => {
    const originalOwner = await ownable.owner();
    await assertRevert(ownable.transferOwnership(null, { from: originalOwner }));
  });

});
