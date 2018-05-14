const NFTokenEnumerable = artifacts.require('NFTokenEnumerableMock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');

contract('NFTokenEnumerableMock', (accounts) => {
  let nftoken;
  const id1 = 1;
  const id2 = 2;
  const id3 = 3;
  const id4 = 40;

  beforeEach(async () => {
    nftoken = await NFTokenEnumerable.new();
  });

  it('correctly checks all the supported interfaces', async () => {
    const nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    const nftokenMetadataInterface = await nftoken.supportsInterface('0x5b5e139f');
    const nftokenEnumerableInterface = await nftoken.supportsInterface('0x780e9d63');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenMetadataInterface, false);
    assert.equal(nftokenEnumerableInterface, true);
  });

  it('correctly mint a new nftoken', async () => {
    const { logs } = await nftoken.mint(accounts[1], id1);
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);
    const owner = await nftoken.ownerOf(id1);
    assert.equal(owner, accounts[1]);
  });

  it('returns the correct total supply', async () => {
    const totalSupply0 = await nftoken.totalSupply();
    assert.equal(totalSupply0, 0);

    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);

    const totalSupply1 = await nftoken.totalSupply();
    assert.equal(totalSupply1, 2);
  });

  it('returns the correct token by index', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[2], id3);

    const tokenId = await nftoken.tokenByIndex(1);
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

    const tokenId = await nftoken.tokenOfOwnerByIndex(accounts[1], 1);
    assert.equal(tokenId, id2);
  });

  it('throws when trying to get token of owner by unexistant index', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[2], id3);

    await assertRevert(nftoken.tokenOfOwnerByIndex(accounts[1], 1));
  });

  it('corectly burns a NFTokens', async () => {
    await nftoken.mint(accounts[1], id2);
    const { logs } = await nftoken.burn(accounts[1], id2);
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const balance = await nftoken.balanceOf(accounts[1]);
    assert.equal(balance, 0);

    await assertRevert(nftoken.ownerOf(id2));

    const totalSupply = await nftoken.totalSupply();
    assert.equal(totalSupply, 0);

    await assertRevert(nftoken.tokenByIndex(0));
    await assertRevert(nftoken.tokenOfOwnerByIndex(accounts[1], 0));
  });

});
