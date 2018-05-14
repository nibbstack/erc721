const NFToken = artifacts.require('NFTokenMock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');
const TokenReceiverMock = artifacts.require('NFTokenReceiverMock');

contract('NFTokenMock', (accounts) => {
  let nftoken;
  const id1 = 1;
  const id2 = 2;
  const id3 = 3;
  const id4 = 40;

  beforeEach(async () => {
    nftoken = await NFToken.new();
  });

  it('correctly checks all the supported interfaces', async () => {
    const nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    const nftokenNonExistingInterface = await nftoken.supportsInterface('0x5b5e139f');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenNonExistingInterface, false);
  });

  it('returns correct balanceOf after mint', async () => {
    await nftoken.mint(accounts[0], id1);
    const count = await nftoken.balanceOf(accounts[0]);
    assert.equal(count.toNumber(), 1);
  });

  it('throws when trying to mint 2 NFTokens with the same claim', async () => {
    await nftoken.mint(accounts[0], id2);
    await assertRevert(nftoken.mint(accounts[0], id2));
  });

  it('throws trying to mint NFToken with empty claim', async () => {
    await assertRevert(nftoken.mint(accounts[0], ''));
  });

  it('throws when trying to mint NFToken to 0x0 address ', async () => {
    await assertRevert(nftoken.mint('0', id3));
  });

  it('finds the correct amount of NFTokens owned by account', async () => {
    await nftoken.mint(accounts[1], id2);
    await nftoken.mint(accounts[1], id3);
    const count = await nftoken.balanceOf(accounts[1]);
    assert.equal(count.toNumber(), 2);
  });

  it('throws when trying to get count of NFTokens owned by 0x0 address', async () => {
    await assertRevert(nftoken.balanceOf('0'));
  });

  it('finds the correct owner of NFToken id', async () => {
    await nftoken.mint(accounts[1], id2);
    const address = await nftoken.ownerOf(id2);
    assert.equal(address, accounts[1]);
  });

  it('throws when trying to find owner od non-existing NFToken id', async () => {
    await assertRevert(nftoken.ownerOf(id4));
  });

  it('correctly approves account', async () => {
    await nftoken.mint(accounts[0], id2);
    await nftoken.approve(accounts[1], id2);
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

  it('throws when trying to get approval of non-existing NFToken id', async () => {
    await assertRevert(nftoken.getApproved(id4));
  });


  it('throws when trying to approve NFToken ID which it does not own', async () => {
    await nftoken.mint(accounts[1], id2);
    await assertRevert(nftoken.approve(accounts[2], id2, {from: accounts[2]}));
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('throws when trying to approve NFToken ID which it already owns', async () => {
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

  it('throws when trying to set a zero address as operator', async () => {
    await assertRevert(nftoken.setApprovalForAll(0, true));
  });

  it('corectly transfers NFToken from owner', async () => {
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

  it('corectly transfers NFToken from approved address', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    await nftoken.mint(owner, id2);
    await nftoken.approve(sender, id2, {from: owner});
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

  it('corectly transfers NFToken as operator', async () => {
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

  it('throws when trying to transfer NFToken as an address that is not owner, approved or operator', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, recipient, id2, {from: sender}));
  });

  it('throws when trying to transfer NFToken to a zero address', async () => {
    const owner = accounts[3];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, 0, id2, {from: owner}));
  });

  it('throws when trying to transfer a non valid nftoken', async () => {
    const owner = accounts[3];
    const recipient = accounts[2];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, recipient, id3, {from: owner}));
  });

  it('corectly safe transfers NFToken from owner', async () => {
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

  it('throws when trying to safe transfers NFToken from owner to a smart contract', async () => {
    const sender = accounts[1];
    const recipient = nftoken.address;

    await nftoken.mint(sender, id2);
    await assertRevert(nftoken.safeTransferFrom(sender, recipient, id2, {from: sender}));
  });

  it('corectly safe transfers NFToken from owner to smart contract that can recieve NFTokens', async () => {
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

  it('corectly burns a NFTokens', async () => {
    await nftoken.mint(accounts[1], id2);
    const { logs } = await nftoken.burn(accounts[1], id2);
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const balance = await nftoken.balanceOf(accounts[1]);
    assert.equal(balance, 0);

    await assertRevert(nftoken.ownerOf(id2));
  });

  it('throws when trying to burn non existant NFToken', async () => {
    await assertRevert(nftoken.burn(accounts[1], id2));
  });
});
