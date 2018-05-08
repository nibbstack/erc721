const ERC721 = artifacts.require('ERC721Mock');
const util = require('ethjs-util');
const assertRevert = require('../helpers/assertRevert');
const TokenReceiverMock = artifacts.require('ERC721TokenReceiverMock');

contract('ERC721', (accounts) => {
  let nftoken;
  let id1 = 1;
  let id2 = 2;
  let id3 = 3;
  let id4 = 40;

  beforeEach(async function () {
    nftoken = await ERC721.new();
  });

  it('correctly checks all the supported interfaces', async () => {
    var nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    var nftokenMetadataInterface = await nftoken.supportsInterface('0x5b5e139f');
    var nftokenEnumerableInterface = await nftoken.supportsInterface('0x780e9d63');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenMetadataInterface, false);
    assert.equal(nftokenEnumerableInterface, false);
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

  it('throws when trying to mint NFToken from non owner ot authorized address', async () => {
    await assertRevert(nftoken.mint('0', id3, { from: accounts[1] }));
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

  it('throws when trying to find owner od none existant NFToken id', async () => {
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

  it('throws when trying to get approval of none existant NFToken id', async () => {
    await assertRevert(nftoken.getApproved(id4));
  });


  it('throws when trying to approve NFToken id that we are not the owner of', async () => {
    await nftoken.mint(accounts[1], id2);
    await assertRevert(nftoken.approve(accounts[1], id2));
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('correctly sets an operator', async () => {
    var { logs } = await nftoken.setApprovalForAll(accounts[6], true);
    let approvalForAllEvent = logs.find(e => e.event === 'ApprovalForAll');
    assert.notEqual(approvalForAllEvent, undefined);

    var isApprovedForAll = await nftoken.isApprovedForAll(accounts[0], accounts[6]);
    assert.equal(isApprovedForAll, true);
  });

  it('correctly sets than cancels an operator', async () => {
    await nftoken.setApprovalForAll(accounts[6], true);
    await nftoken.setApprovalForAll(accounts[6], false);

    var isApprovedForAll = await nftoken.isApprovedForAll(accounts[0], accounts[6]);
    assert.equal(isApprovedForAll, false);
  });

  it('throws when trying to set a zero address as operator', async () => {
    await assertRevert(nftoken.setApprovalForAll(0, true));
  });

  it('corectly transfers NFToken from owner', async () => {
    var sender = accounts[1];
    var recipient = accounts[2];

    await nftoken.mint(sender, id2);
    var { logs } = await nftoken.transferFrom(sender, recipient, id2, {from: sender});
    let transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    var senderBalance = await nftoken.balanceOf(sender);
    var recipientBalance = await nftoken.balanceOf(recipient);
    var ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly transfers nftoken from approved address', async () => {
    var sender = accounts[1];
    var recipient = accounts[2];
    var owner = accounts[3];

    await nftoken.mint(owner, id2);
    await nftoken.approve(sender, id2, {from: owner});
    var { logs } = await nftoken.transferFrom(owner, recipient, id2, {from: sender});
    let transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    var ownerBalance = await nftoken.balanceOf(owner);
    var recipientBalance = await nftoken.balanceOf(recipient);
    var ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(ownerBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly transfers NFToken as operator', async () => {
    var sender = accounts[1];
    var recipient = accounts[2];
    var owner = accounts[3];

    await nftoken.mint(owner, id2);
    await nftoken.setApprovalForAll(sender, true, {from: owner});
    var { logs } = await nftoken.transferFrom(owner, recipient, id2, {from: sender});
    let transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    var ownerBalance = await nftoken.balanceOf(owner);
    var recipientBalance = await nftoken.balanceOf(recipient);
    var ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(ownerBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('throws when trying to transfer NFToken as an address that is not owner, approved or operator', async () => {
    var sender = accounts[1];
    var recipient = accounts[2];
    var owner = accounts[3];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, recipient, id2, {from: sender}));
  });

  it('throws when trying to transfer NFToken to a zero address', async () => {
    var owner = accounts[3];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, 0, id2, {from: owner}));
  });

  it('throws when trying to transfer a non valid nftoken', async () => {
    var owner = accounts[3];
    var recipient = accounts[2];

    await nftoken.mint(owner, id2);
    await assertRevert(nftoken.transferFrom(owner, 0, id3, {from: owner}));
  });

  it('corectly safe transfers NFToken from owner', async () => {
    var sender = accounts[1];
    var recipient = accounts[2];

    await nftoken.mint(sender, id2);
    var { logs } = await nftoken.safeTransferFrom(sender, recipient, id2, {from: sender});
    let transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    var senderBalance = await nftoken.balanceOf(sender);
    var recipientBalance = await nftoken.balanceOf(recipient);
    var ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('throws when trying to safe transfers NFToken from owner to a smart contract', async () => {
    var sender = accounts[1];
    var recipient = nftoken.address;

    await nftoken.mint(sender, id2);
    await assertRevert(nftoken.safeTransferFrom(sender, recipient, id2, {from: sender}));
  });

  it('corectly safe transfers NFToken from owner to smart contract that can recieve NFTokens', async () => {
    var sender = accounts[1];
    var tokenReceiverMock = await TokenReceiverMock.new();
    var recipient = tokenReceiverMock.address;

    await nftoken.mint(sender, id2);
    var { logs } = await nftoken.safeTransferFrom(sender, recipient, id2, {from: sender});
    let transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    var senderBalance = await nftoken.balanceOf(sender);
    var recipientBalance = await nftoken.balanceOf(recipient);
    var ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

});
