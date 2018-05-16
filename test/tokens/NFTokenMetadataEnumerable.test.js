const NFTokenMetadataEnumerable = artifacts.require('NFTokenMetadataEnumerableMock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');

contract('NFTokenMetadataEnumerableMock', (accounts) => {
  let nftoken;
  const id1 = 1;
  const id2 = 2;
  const id3 = 3;
  const id4 = 40;

  beforeEach(async () => {
    nftoken = await NFTokenMetadataEnumerable.new('Foo', 'F');
  });

  it('correctly checks all the supported interfaces', async () => {
    const nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    const nftokenMetadataInterface = await nftoken.supportsInterface('0x5b5e139f');
    const nftokenEnumerableInterface = await nftoken.supportsInterface('0x780e9d63');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenMetadataInterface, true);
    assert.equal(nftokenEnumerableInterface, true);
  });

  it('returns the correct issuer name', async () => {
    const name = await nftoken.name();
    assert.equal(name, 'Foo');
  });

  it('returns the correct issuer symbol', async () => {
    const symbol = await nftoken.symbol();
    assert.equal(symbol, 'F');
  });

  it('returns the correct NFT id 2 url', async () => {
    await nftoken.mint(accounts[1], id2, 'url2');
    const tokenURI = await nftoken.tokenURI(id2);
    assert.equal(tokenURI, 'url2');
  });

  it('throws when trying to get uri of none existant NFT id', async () => {
    await assertRevert(nftoken.tokenURI(id4));
  });

  it('returns the correct total supply', async () => {
    const totalSupply0 = await nftoken.totalSupply();
    assert.equal(totalSupply0, 0);

    await nftoken.mint(accounts[1], id1, 'url1');
    await nftoken.mint(accounts[1], id2, 'url2');

    const totalSupply1 = await nftoken.totalSupply();
    assert.equal(totalSupply1, 2);
  });

  it('returns the correct total supply', async () => {
    const totalSupply0 = await nftoken.totalSupply();
    assert.equal(totalSupply0, 0);

    await nftoken.mint(accounts[1], id1, 'url1');
    await nftoken.mint(accounts[1], id2, 'url2');

    const totalSupply1 = await nftoken.totalSupply();
    assert.equal(totalSupply1, 2);
  });

  it('returns the correct token by index', async () => {
    await nftoken.mint(accounts[1], id1, 'url1');
    await nftoken.mint(accounts[1], id2, 'url2');
    await nftoken.mint(accounts[2], id3, 'url3');

    const tokenId = await nftoken.tokenByIndex(1);
    assert.equal(tokenId, id2);
  });

  it('throws when trying to get token by unexistant index', async () => {
    await nftoken.mint(accounts[1], id1, 'url1');
    await assertRevert(nftoken.tokenByIndex(1));
  });

  it('returns the correct token of owner by index', async () => {
    await nftoken.mint(accounts[1], id1, 'url1');
    await nftoken.mint(accounts[1], id2, 'url2');
    await nftoken.mint(accounts[2], id3, 'url3');

    const tokenId = await nftoken.tokenOfOwnerByIndex(accounts[1], 1);
    assert.equal(tokenId, id2);
  });

  it('throws when trying to get token of owner by unexistant index', async () => {
    await nftoken.mint(accounts[1], id1, 'url1');
    await nftoken.mint(accounts[2], id3, 'url3');

    await assertRevert(nftoken.tokenOfOwnerByIndex(accounts[1], 1));
  });

  it('corectly burns a NFT', async () => {
    await nftoken.mint(accounts[1], id2, 'url2');
    const { logs } = await nftoken.burn(accounts[1], id2);
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const balance = await nftoken.balanceOf(accounts[1]);
    assert.equal(balance, 0);

    const totalSupply = await nftoken.totalSupply();
    assert.equal(totalSupply, 0);

    await assertRevert(nftoken.ownerOf(id2));
    await assertRevert(nftoken.tokenByIndex(0));
    await assertRevert(nftoken.tokenOfOwnerByIndex(accounts[1], 0));

    const uri = await nftoken.checkUri(id2);
    assert.equal(uri, '');
  });
});
