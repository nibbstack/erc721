const ERC721Metadata = artifacts.require('ERC721MetadataMock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');

contract('ERC721MetadataMock', (accounts) => {
  let nftoken;
  let id1 = 1;
  let id2 = 2;
  let id3 = 3;
  let id4 = 40;

  beforeEach(async function () {
    nftoken = await ERC721Metadata.new('Foo', 'F');
  });

  it('correctly checks all the supported interfaces', async () => {
    var nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    var nftokenMetadataInterface = await nftoken.supportsInterface('0x5b5e139f');
    var nftokenEnumerableInterface = await nftoken.supportsInterface('0x780e9d63');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenMetadataInterface, true);
    assert.equal(nftokenEnumerableInterface, false);
  });

  it('returns the correct issuer name', async () => {
    const name = await nftoken.name();
    assert.equal(name, 'Foo');
  });

  it('returns the correct issuer symbol', async () => {
    const symbol = await nftoken.symbol();
    assert.equal(symbol, 'F');
  });

  it('returns the correct NFToken id 2 url', async () => {
    await nftoken.mint(accounts[1], id2, 'url2');
    const tokenURI = await nftoken.tokenURI(id2);
    assert.equal(tokenURI, 'url2');
  });

  it('throws when trying to get uri of none existant NFToken id', async () => {
    await assertRevert(nftoken.tokenURI(id4));
  });

});
