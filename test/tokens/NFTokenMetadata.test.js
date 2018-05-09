const NFTokenMetadata = artifacts.require('NFTokenMetadataMock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');

contract('NFTokenMetadataMock', (accounts) => {
  let nftoken;
  let id1 = 1;
  let id2 = 2;
  let id3 = 3;
  let id4 = 40;

  beforeEach(async function () {
    nftoken = await NFTokenMetadata.new('Foo', 'F');
  });

  it('correctly checks all the supported interfaces', async () => {
    var nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    var nftokenMetadataInterface = await nftoken.supportsInterface('0x5b5e139f');
    var nftokenNonExistingInterface = await nftoken.supportsInterface('0x780e9d63');
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

  it('correctly mints and checks NFToken id 2 url', async () => {
    var { logs } = await nftoken.mint(accounts[1], id2, 'url2');
    let transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const tokenURI = await nftoken.tokenURI(id2);
    assert.equal(tokenURI, 'url2');
  });

  it('throws when trying to get URI of invalid NFToken ID', async () => {
    await assertRevert(nftoken.tokenURI(id4));
  });

  it('corectly burns a NFTokens', async () => {
    await nftoken.mint(accounts[1], id2, 'url');
    var { logs } = await nftoken.burn(accounts[1], id2);
    let transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    var balance = await nftoken.balanceOf(accounts[1]);

    assert.equal(balance, 0);

    await assertRevert(nftoken.ownerOf(id2));

    var uri = await nftoken.checkUri(id2);
    assert.equal(uri, '');
  });

});
