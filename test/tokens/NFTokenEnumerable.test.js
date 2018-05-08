const NFTokenEnumerable = artifacts.require('NFTokenEnumerableMock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');

contract('NFTokenEnumerableMock', (accounts) => {
  let nftoken;
  let id1 = 1;
  let id2 = 2;
  let id3 = 3;
  let id4 = 40;

  beforeEach(async function () {
    nftoken = await NFTokenEnumerable.new();
  });

  it('correctly checks all the supported interfaces', async () => {
    var nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    var nftokenMetadataInterface = await nftoken.supportsInterface('0x5b5e139f');
    var nftokenEnumerableInterface = await nftoken.supportsInterface('0x780e9d63');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenMetadataInterface, false);
    assert.equal(nftokenEnumerableInterface, true);
  });

  it('returns the correct total supply', async () => {
    var totalSupply = await nftoken.totalSupply();
    assert.equal(totalSupply, 0);

    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);

    var totalSupply = await nftoken.totalSupply();
    assert.equal(totalSupply, 2);
  });

  it('returns the correct total supply', async () => {
    var totalSupply = await nftoken.totalSupply();
    assert.equal(totalSupply, 0);

    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);

    var totalSupply = await nftoken.totalSupply();
    assert.equal(totalSupply, 2);
  });

  it('returns the correct token by index', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[2], id3);

    var tokenId = await nftoken.tokenByIndex(1);
    assert.equal(tokenId, id2);
  });

  it('throws when trying to get token by unexistant index', async () => {
    await nftoken.mint(accounts[1], id1);
    await assertRevert(nftoken.tokenByIndex(1));
  });

  it('returns the correct token of owner by index', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[2], id3);

    var tokenId = await nftoken.tokenOfOwnerByIndex(accounts[1], 1);
    assert.equal(tokenId, id2);
  });

  it('throws when trying to get token of owner by unexistant index', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[2], id3);

    await assertRevert(nftoken.tokenOfOwnerByIndex(accounts[1], 1));
  });

});
