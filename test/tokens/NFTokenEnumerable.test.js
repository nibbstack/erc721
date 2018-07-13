const NFTokenEnumerable = artifacts.require('NFTokenEnumerableMock');
const NFTokenEnumerableTest = artifacts.require('../mocks/NFTokenEnumerableTestMock.sol');
const assertRevert = require('../helpers/assertRevert');
const expectThrow = require('../helpers/expectThrow');

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

  it('corectly burns a NFT', async () => {
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[1], id3);
    const { logs } = await nftoken.burn(id2);
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

  it('mint should correctly set ownerToIds and idToOwnerIndex and idToIndex', async () => {
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

    const idToIndexFirst = await nftoken.idToIndexWrapper(id1);
    const idToIndexSecond = await nftoken.idToIndexWrapper(id3);
    const idToIndexThird = await nftoken.idToIndexWrapper(id2);

    assert.strictEqual(idToIndexFirst.toNumber(), 0);
    assert.strictEqual(idToIndexSecond.toNumber(), 1);
    assert.strictEqual(idToIndexThird.toNumber(), 2);
  });

  it('burn should correctly set ownerToIds and idToOwnerIndex and idToIndex', async () => {
    nftoken = await NFTokenEnumerableTest.new();
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id3);
    await nftoken.mint(accounts[1], id2);

    //burn id1
    await nftoken.burn(id1, {from: accounts[0]});

    let idToOwnerIndexId3 = await nftoken.idToOwnerIndexWrapper(id3);
    let idToOwnerIndexId2 = await nftoken.idToOwnerIndexWrapper(id2);
    assert.strictEqual(idToOwnerIndexId3.toNumber(), 1);
    assert.strictEqual(idToOwnerIndexId2.toNumber(), 0);

    let ownerToIdsLenPrior = await nftoken.ownerToIdsLen(accounts[1]);
    let ownerToIdsFirst = await nftoken.ownerToIdbyIndex(accounts[1], 0);
    let ownerToIdsSecond = await nftoken.ownerToIdbyIndex(accounts[1], 1);
    assert.strictEqual(ownerToIdsLenPrior.toString(), '2');
    assert.strictEqual(ownerToIdsFirst.toNumber(), id2);
    assert.strictEqual(ownerToIdsSecond.toNumber(), id3);

    let idToIndexFirst = await nftoken.idToIndexWrapper(id2);
    let idToIndexSecond = await nftoken.idToIndexWrapper(id3);

    assert.strictEqual(idToIndexFirst.toNumber(), 0);
    assert.strictEqual(idToIndexSecond.toNumber(), 1);

    let tokenIndexFirst = await nftoken.tokenByIndex(0);
    let tokenIndexSecond = await nftoken.tokenByIndex(1);

    assert.strictEqual(tokenIndexFirst.toNumber(), id2);
    assert.strictEqual(tokenIndexSecond.toNumber(), id3);

    //burn id2
    await nftoken.burn(id2, {from: accounts[0]});

    idToOwnerIndexId3 = await nftoken.idToOwnerIndexWrapper(id3);
    assert.strictEqual(idToOwnerIndexId3.toNumber(), 0);

    ownerToIdsLenPrior = await nftoken.ownerToIdsLen(accounts[1]);
    ownerToIdsFirst = await nftoken.ownerToIdbyIndex(accounts[1], 0);
    assert.strictEqual(ownerToIdsLenPrior.toString(), '1');
    assert.strictEqual(ownerToIdsFirst.toNumber(), id3);

    idToIndexFirst = await nftoken.idToIndexWrapper(id3);

    assert.strictEqual(idToIndexFirst.toNumber(), 0);

    tokenIndexFirst = await nftoken.tokenByIndex(0);

    assert.strictEqual(tokenIndexFirst.toNumber(), id3);

    //burn id3
    await nftoken.burn(id3, {from: accounts[0]});

    idToOwnerIndexId3 = await nftoken.idToOwnerIndexWrapper(id3);
    assert.strictEqual(idToOwnerIndexId3.toNumber(), 0);

    ownerToIdsLenPrior = await nftoken.ownerToIdsLen(accounts[1]);
    assert.strictEqual(ownerToIdsLenPrior.toString(), '0');

    await expectThrow(nftoken.ownerToIdbyIndex(accounts[1], 0));

    idToIndexFirst = await nftoken.idToIndexWrapper(id3);

    assert.strictEqual(idToIndexFirst.toNumber(), 0);
  });

  it('transfer should correctly set ownerToIds and idToOwnerIndex and idToIndex', async () => {
    nftoken = await NFTokenEnumerableTest.new();
    await nftoken.mint(accounts[1], id1);
    await nftoken.mint(accounts[1], id3);
    await nftoken.mint(accounts[1], id2);

    await nftoken.transferFrom(accounts[1], accounts[2], id1, {from: accounts[1]});

    let idToOwnerIndexId1 = await nftoken.idToOwnerIndexWrapper(id1);
    let idToOwnerIndexId3 = await nftoken.idToOwnerIndexWrapper(id3);
    let idToOwnerIndexId2 = await nftoken.idToOwnerIndexWrapper(id2);
    assert.strictEqual(idToOwnerIndexId1.toNumber(), 0);
    assert.strictEqual(idToOwnerIndexId3.toNumber(), 1);
    assert.strictEqual(idToOwnerIndexId2.toNumber(), 0);

    let ownerToIdsLenPrior = await nftoken.ownerToIdsLen(accounts[1]);
    let ownerToIdsFirst = await nftoken.ownerToIdbyIndex(accounts[1], 0);
    let ownerToIdsSecond = await nftoken.ownerToIdbyIndex(accounts[1], 1);
    await expectThrow(nftoken.ownerToIdbyIndex(accounts[1], 2));

    assert.strictEqual(ownerToIdsLenPrior.toString(), '2');
    assert.strictEqual(ownerToIdsFirst.toNumber(), id2);
    assert.strictEqual(ownerToIdsSecond.toNumber(), id3);

    ownerToIdsLenPrior = await nftoken.ownerToIdsLen(accounts[2]);
    ownerToIdsFirst = await nftoken.ownerToIdbyIndex(accounts[2], 0);
    assert.strictEqual(ownerToIdsLenPrior.toString(), '1');
    assert.strictEqual(ownerToIdsFirst.toNumber(), id1);
  });
});
