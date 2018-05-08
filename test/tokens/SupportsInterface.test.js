const SupportsInterface = artifacts.require('SupportsInterface');

contract('SupportsInterface', (accounts) => {

  var supportsInterface;

  beforeEach(async function () {
    supportsInterface = await SupportsInterface.new();
  });

  it('correctly checks all the supported interfaces', async () => {
    var erc165 = await supportsInterface.supportsInterface('0x01ffc9a7');
    assert.equal(erc165, true);
  });

  it('checks if 0xffffffff is false', async () => {
    var element = await supportsInterface.supportsInterface('0xffffffff');
    assert.equal(element, false);
  });

});
