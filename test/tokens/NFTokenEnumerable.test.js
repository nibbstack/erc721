const NFTokenEnumerable = artifacts.require('NFTokenEnumerableMock');
const NFTokenEnumerableTest = artifacts.require('../mocks/NFTokenEnumerableTestMock.sol');
const TokenReceiverMock = artifacts.require('NFTokenReceiverTestMock');
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

  it('returns correct balanceOf after mint', async () => {
    await nftoken.mint(accounts[0], id1);
    const count = await nftoken.balanceOf(accounts[0]);
    assert.equal(count.toNumber(), 1);
  });

  it('throws when trying to mint 2 NFTs with the same ids', async () => {
    await nftoken.mint(accounts[0], id2);
    await assertRevert(nftoken.mint(accounts[0], id2));
  });

  it('throws when trying to mint NFT to 0x0 address ', async () => {
    await assertRevert(nftoken.mint('0', id3));
  });

  it('finds the correct amount of NFTs owned by account', async () => {
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[1], id3);
    const count = await nftoken.balanceOf(accounts[1]);
    assert.equal(count.toNumber(), 2);
  });

  it('throws when trying to get count of NFTs owned by 0x0 address', async () => {
    await assertRevert(nftoken.balanceOf('0'));
  });

  it('finds the correct owner of NFToken id', async () => {
    await nftoken.mint(accounts[1], id2);
    const address = await nftoken.ownerOf(id2);
    assert.equal(address, accounts[1]);
  });

  it('throws when trying to find owner od non-existing NFT id', async () => {
    await assertRevert(nftoken.ownerOf(id4));
  });

  it('correctly approves account', async () => {
    await nftoken.mint(accounts[0], id2);
    const { logs } = await nftoken.approve(accounts[1], id2);
    const approvalEvent = logs.find(e => e.event === 'Approval');
    assert.notEqual(approvalEvent, undefined);

    const address = await nftoken.getApproved(id2);
    assert.equal(address, accounts[1]);
  });

  it('correctly cancels approval of account[1]', async () => {
    await nftoken.mint(accounts[0], id2);
    await nftoken.approve(accounts[1], id2);
    await nftoken.approve(0, id2);
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('throws when trying to get approval of non-existing NFT id', async () => {
    await assertRevert(nftoken.getApproved(id4));
  });


  it('throws when trying to approve NFT ID which it does not own', async () => {
    await nftoken.mint(accounts[1], id2);
    await assertRevert(nftoken.approve(accounts[2], id2, {from: accounts[2]}));
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('throws when trying to approve NFT ID which it already owns', async () => {
    await nftoken.mint(accounts[1], id2);
    await assertRevert(nftoken.approve(accounts[1], id2));
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('correctly sets an operator', async () => {
    await nftoken.mint(accounts[0], id2);
    const { logs } = await nftoken.setApprovalForAll(accounts[6], true);
    const approvalForAllEvent = logs.find(e => e.event === 'ApprovalForAll');
    assert.notEqual(approvalForAllEvent, undefined);
    const isApprovedForAll = await nftoken.isApprovedForAll(accounts[0], accounts[6]);
    assert.equal(isApprovedForAll, true);
  });

  it('correctly sets then cancels an operator', async () => {
    await nftoken.mint(accounts[0], id2);
    await nftoken.setApprovalForAll(accounts[6], true);
    await nftoken.setApprovalForAll(accounts[6], false);

    const isApprovedForAll = await nftoken.isApprovedForAll(accounts[0], accounts[6]);
    assert.equal(isApprovedForAll, false);
  });

  it('corectly transfers NFT from owner', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];

    await nftoken.mint(sender, id2);
    const { logs } = await nftoken.transferFrom(sender, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const senderBalance = await nftoken.balanceOf(sender);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly transfers NFT from approved address', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    await nftoken.mint(owner, id2);
    let result = await nftoken.approve(sender, id2, {from: owner});   
    const approvalEvent1 = result.logs.find(e => e.event === 'Approval');
    assert.notEqual(approvalEvent1, undefined);

    result = await nftoken.transferFrom(owner, recipient, id2, {from: sender});
    const transferEvent = result.logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);
    const approvalEvent2 = result.logs.find(e => e.event === 'Approval');
    assert.equal(approvalEvent2, undefined);

    const ownerBalance = await nftoken.balanceOf(owner);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(ownerBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly transfers NFT as operator', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    await nftoken.mint(owner, id2);
    await nftoken.setApprovalForAll(sender, true, {from: owner});
    const { logs } = await nftoken.transferFrom(owner, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const ownerBalance = await nftoken.balanceOf(owner);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(ownerBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('throws when trying to transfer NFT as an address that is not owner, approved or operator', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, recipient, id2, {from: sender}));
  });

  it('throws when trying to transfer NFT to a zero address', async () => {
    const owner = accounts[3];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, 0, id2, {from: owner}));
  });

  it('throws when trying to transfer a invalid NFT', async () => {
    const owner = accounts[3];
    const recipient = accounts[2];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, recipient, id3, {from: owner}));
  });

  it('corectly safe transfers NFT from owner', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];

    await nftoken.mint(sender, id2);
    const { logs } = await nftoken.safeTransferFrom(sender, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const senderBalance = await nftoken.balanceOf(sender);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('throws when trying to safe transfers NFT from owner to a smart contract', async () => {
    const sender = accounts[1];
    const recipient = nftoken.address;

    await nftoken.mint(sender, id2);
    await assertRevert(nftoken.safeTransferFrom(sender, recipient, id2, {from: sender}));
  });

  it('corectly safe transfers NFT from owner to smart contract that can recieve NFTs', async () => {
    const sender = accounts[1];
    const tokenReceiverMock = await TokenReceiverMock.new();
    const recipient = tokenReceiverMock.address;

    await nftoken.mint(sender, id2);
    const { logs } = await nftoken.safeTransferFrom(sender, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const senderBalance = await nftoken.balanceOf(sender);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly burns a NFT', async () => {
    await nftoken.mint(accounts[1], id2);
    const { logs } = await nftoken.burn(id2);

    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const approvalEvent = logs.find(e => e.event === 'Approval');
    assert.equal(approvalEvent, undefined);

    const balance = await nftoken.balanceOf(accounts[1]);
    assert.equal(balance, 0);

    await assertRevert(nftoken.ownerOf(id2));
  });

  it('throws when trying to burn non existant NFT', async () => {
    await assertRevert(nftoken.burn(id2));
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
