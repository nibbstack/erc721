const SupportsInterface = artifacts.require('SupportsInterface');

contract('SupportsInterface', (accounts) => {

  var supportsInterface;

  beforeEach(async () => {
    supportsInterface = await SupportsInterface.new();
  });

  it('correctly checks all the supported interfaces', async () => {
    const erc165 = await supportsInterface.supportsInterface('0x01ffc9a7');
    assert.equal(erc165, true);
  });

  it('checks if 0xffffffff is false', async () => {
    const element = await supportsInterface.supportsInterface('0xffffffff');
    assert.equal(element, false);
  });

});
