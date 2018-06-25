const NFTokenEnumerable = artifacts.require('NFTokenEnumerableMock');
const NFTokenEnumerableTest = artifacts.require('../mocks/NFTokenEnumerableTestMock.sol');
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

  it('correctly mints a new NFT', async () => {
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

    let tokenId = await nftoken.tokenByIndex(0);
    assert.equal(tokenId, id1);

    tokenId = await nftoken.tokenByIndex(1);
    assert.equal(tokenId, id2);

    tokenId = await nftoken.tokenByIndex(2);
    assert.equal(tokenId, id3);
  });

  it('throws when trying to get token by non-existing index', async () => {
    await nftoken.mint(accounts[1], id1);
    await assertRevert(nftoken.tokenByIndex(10));
  });

  it('returns the correct token of owner by index', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[2], id3);

    const tokenId = await nftoken.tokenOfOwnerByIndex(accounts[1], 1);
    assert.equal(tokenId, id2);
  });

  it('throws when trying to get token of owner by non-existing index', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[2], id3);

    await assertRevert(nftoken.tokenOfOwnerByIndex(accounts[1], 4));
  });

  it('removeNFToken should correctly update ownerToIds and idToOwnerIndex', async () => {
    nftoken = await NFTokenEnumerableTest.new();
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id3);
    await nftoken.mint(accounts[1], id2);

    const idToOwnerIndexId1 = await nftoken.idToOwnerIndexWrapper(id1);
    const idToOwnerIndexId3 = await nftoken.idToOwnerIndexWrapper(id3);
    const idToOwnerIndexId2 = await nftoken.idToOwnerIndexWrapper(id2);
    assert.strictEqual(idToOwnerIndexId1.toNumber(), 0);
    assert.strictEqual(idToOwnerIndexId3.toNumber(), 1);
    assert.strictEqual(idToOwnerIndexId2.toNumber(), 2);

    const ownerToIdsLenPrior = await nftoken.ownerToIdsLen(accounts[1]);
    const ownerToIdsFirst = await nftoken.ownerToIdbyIndex(accounts[1], 0);
    const ownerToIdsSecond = await nftoken.ownerToIdbyIndex(accounts[1], 1);
    const ownerToIdsThird = await nftoken.ownerToIdbyIndex(accounts[1], 2);
    assert.strictEqual(ownerToIdsLenPrior.toString(), '3');
    assert.strictEqual(ownerToIdsFirst.toNumber(), id1);
    assert.strictEqual(ownerToIdsSecond.toNumber(), id3);
    assert.strictEqual(ownerToIdsThird.toNumber(), id2);

    await nftoken.removeNFTokenWrapper(accounts[1], id3);

    const ownerToIdsLenAfter = await nftoken.ownerToIdsLen(accounts[1]);
    const ownerToIdsRemaining1 = await nftoken.ownerToIdbyIndex(accounts[1], 0);
    const ownerToIdsRemaining2 = await nftoken.ownerToIdbyIndex(accounts[1], 1);
    assert.strictEqual(ownerToIdsLenAfter.toString(), '2');
    assert.strictEqual(ownerToIdsRemaining1.toNumber(), id1);
    assert.strictEqual(ownerToIdsRemaining2.toNumber(), id2);

    const idToOwnerIndexId1After = await nftoken.idToOwnerIndexWrapper(id1);
    const idToOwnerIndexId2After = await nftoken.idToOwnerIndexWrapper(id2);
    assert.strictEqual(idToOwnerIndexId1After.toNumber(), 0);
    assert.strictEqual(idToOwnerIndexId2After.toNumber(), 1);
  });

  it('addNFToken should correctly update ownerToIds and idToOwnerIndex', async () => {
    nftoken = await NFTokenEnumerableTest.new();

    const ownerToIdsLenPrior = await nftoken.ownerToIdsLen(accounts[1]);
    assert.strictEqual(ownerToIdsLenPrior.toString(), '0');

    await nftoken.addNFTokenWrapper(accounts[1], id1);
    await nftoken.addNFTokenWrapper(accounts[1], id3);
    await nftoken.addNFTokenWrapper(accounts[1], id2);

    const ownerToIdsLenAfter = await nftoken.ownerToIdsLen(accounts[1]);
    assert.strictEqual(ownerToIdsLenAfter.toString(), '3');

    const ownerToIdsFirst = await nftoken.ownerToIdbyIndex(accounts[1], 0);
    const ownerToIdsSecond = await nftoken.ownerToIdbyIndex(accounts[1], 1);
    const ownerToIdsThird = await nftoken.ownerToIdbyIndex(accounts[1], 2);
    assert.strictEqual(ownerToIdsFirst.toNumber(), id1);
    assert.strictEqual(ownerToIdsSecond.toNumber(), id3);
    assert.strictEqual(ownerToIdsThird.toNumber(), id2);

    const idToOwnerIndexId1 = await nftoken.idToOwnerIndexWrapper(id1);
    const idToOwnerIndexId3 = await nftoken.idToOwnerIndexWrapper(id3);
    const idToOwnerIndexId2 = await nftoken.idToOwnerIndexWrapper(id2);
    assert.strictEqual(idToOwnerIndexId1.toNumber(), 0);
    assert.strictEqual(idToOwnerIndexId3.toNumber(), 1);
    assert.strictEqual(idToOwnerIndexId2.toNumber(), 2);
  });

  it('corectly burns a NFT', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[1], id3);
    const { logs } = await nftoken.burn(accounts[1], id2);
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const balance = await nftoken.balanceOf(accounts[1]);
    assert.equal(balance, 2);

    await assertRevert(nftoken.ownerOf(id2));

    const totalSupply = await nftoken.totalSupply();
    assert.equal(totalSupply, 2);

    await assertRevert(nftoken.tokenByIndex(2));
    await assertRevert(nftoken.tokenOfOwnerByIndex(accounts[1], 2));

    let tokenId = await nftoken.tokenByIndex(0);
    assert.equal(tokenId, id1);

    tokenId = await nftoken.tokenByIndex(1);
    assert.equal(tokenId, id3);
  });
});
