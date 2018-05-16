const NFTokenMetadata = artifacts.require('NFTokenMetadataMock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');

contract('NFTokenMetadataMock', (accounts) => {
  let nftoken;
  const id1 = 1;
  const id2 = 2;
  const id3 = 3;
  const id4 = 40;

  beforeEach(async () => {
    nftoken = await NFTokenMetadata.new('Foo', 'F');
  });

  it('correctly checks all the supported interfaces', async () => {
    const nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    const nftokenMetadataInterface = await nftoken.supportsInterface('0x5b5e139f');
    const nftokenNonExistingInterface = await nftoken.supportsInterface('0x780e9d63');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenMetadataInterface, true);
    assert.equal(nftokenNonExistingInterface, false);
  });

  it('returns the correct issuer name', async () => {
    const name = await nftoken.name();
    assert.equal(name, 'Foo');
  });

  it('returns the correct issuer symbol', async () => {
    const symbol = await nftoken.symbol();
    assert.equal(symbol, 'F');
  });

  it('correctly mints and checks NFT id 2 url', async () => {
    const { logs } = await nftoken.mint(accounts[1], id2, 'url2');
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const tokenURI = await nftoken.tokenURI(id2);
    assert.equal(tokenURI, 'url2');
  });

  it('throws when trying to get URI of invalid NFT ID', async () => {
    await assertRevert(nftoken.tokenURI(id4));
  });

  it('corectly burns a NFT', async () => {
    await nftoken.mint(accounts[1], id2, 'url');
    const { logs } = await nftoken.burn(accounts[1], id2);
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const balance = await nftoken.balanceOf(accounts[1]);
    assert.equal(balance, 0);

    await assertRevert(nftoken.ownerOf(id2));

    const uri = await nftoken.checkUri(id2);
    assert.equal(uri, '');
  });

});
