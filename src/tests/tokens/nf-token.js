const { expect } = require('chai');

describe('nf-token', function() {
  let nfToken, owner, bob, jane, sara;
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const id1 = 123;
  const id2 = 124;

  beforeEach(async () => {
    const nftContract = await ethers.getContractFactory('NFTokenTestMock');
    nfToken = await nftContract.deploy();
    [ owner, bob, jane, sara] = await ethers.getSigners();
    await nfToken.deployed();
  });

  it('correctly checks all the supported interfaces', async function() {
    expect(await nfToken.supportsInterface('0x80ac58cd')).to.equal(true);
    expect(await nfToken.supportsInterface('0x5b5e139f')).to.equal(false);
  });

  it('correctly mints a NFT', async function() {
    expect(await nfToken.connect(owner).mint(bob.address, 1)).to.emit(nfToken, 'Transfer');
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
  });

  it('returns correct balanceOf', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    await nfToken.connect(owner).mint(bob.address, id2);
    expect(await nfToken.balanceOf(bob.address)).to.equal(2);
  });

  it('throws when trying to get count of NFTs owned by 0x0 address', async function() {
    await expect(nfToken.balanceOf(zeroAddress)).to.be.revertedWith('003001');
  });

  it('throws when trying to mint 2 NFTs with the same ids', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await expect(nfToken.connect(owner).mint(bob.address, id1)).to.be.revertedWith('003006');
  });

  it('throws when trying to mint NFT to 0x0 address', async function() {
    await expect(nfToken.connect(owner).mint(zeroAddress, id1)).to.be.revertedWith('003001');
  });

  it('finds the correct owner of NFToken id', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.ownerOf(id1)).to.equal(bob.address);
  });

  it('throws when trying to find owner od non-existing NFT id', async function() {
    await expect(nfToken.ownerOf(id1)).to.be.revertedWith('003002');
  });

  it('correctly approves account', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.connect(bob).approve(sara.address, id1)).to.emit(nfToken, 'Approval');
    expect(await nfToken.getApproved(id1)).to.equal(sara.address);
  });

  it('correctly cancels approval', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(bob).approve(sara.address, id1);
    await nfToken.connect(bob).approve(zeroAddress, id1);
    expect(await nfToken.getApproved(id1)).to.equal(zeroAddress);
  });

  it('throws when trying to get approval of non-existing NFT id', async function() {
    await expect(nfToken.getApproved(id1)).to.be.revertedWith('003002');
  });

  it('throws when trying to approve NFT ID from a third party', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await expect(nfToken.connect(sara).approve(sara.address, id1)).to.be.revertedWith('003003');
  });

  it('correctly sets an operator', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.connect(bob).setApprovalForAll(sara.address, true)).to.emit(nfToken, 'ApprovalForAll');
    expect(await nfToken.isApprovedForAll(bob.address, sara.address)).to.equal(true);
  });

  it('correctly sets then cancels an operator', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(bob).setApprovalForAll(sara.address, true);
    await nfToken.connect(bob).setApprovalForAll(sara.address, false);
    expect(await nfToken.isApprovedForAll(bob.address, sara.address)).to.equal(false);
  });

  it('correctly transfers NFT from owner', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.connect(bob).transferFrom(bob.address, sara.address, id1)).to.emit(nfToken, 'Transfer');
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(sara.address)).to.equal(1);
    expect(await nfToken.ownerOf(id1)).to.equal(sara.address);
  });

  it('correctly transfers NFT from approved address', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(bob).approve(sara.address, id1);
    await nfToken.connect(sara).transferFrom(bob.address, jane.address, id1);
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
    expect(await nfToken.ownerOf(id1)).to.equal(jane.address);
  });

  it('correctly transfers NFT as operator', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(bob).setApprovalForAll(sara.address, true);
    await nfToken.connect(sara).transferFrom(bob.address, jane.address, id1);
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
    expect(await nfToken.ownerOf(id1)).to.equal(jane.address);
  });

  it('throws when trying to transfer NFT as an address that is not owner, approved or operator', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await expect(nfToken.connect(sara).transferFrom(bob.address, jane.address, id1)).to.be.revertedWith('003004');
  });

  it('throws when trying to transfer NFT to a zero address', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await expect(nfToken.connect(bob).transferFrom(bob.address, zeroAddress, id1)).to.be.revertedWith('003001');
  });

  it('throws when trying to transfer an invalid NFT', async function() {
    await expect(nfToken.connect(bob).transferFrom(bob.address, sara.address, id1)).to.be.revertedWith('003004');
  });

  it('throws when trying to transfer an invalid NFT', async function() {
    await expect(nfToken.connect(bob).transferFrom(bob.address, sara.address, id1)).to.be.revertedWith('003004');
  });

  it('correctly safe transfers NFT from owner', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.connect(bob)['safeTransferFrom(address,address,uint256)'](bob.address, sara.address, id1)).to.emit(nfToken, 'Transfer');
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(sara.address)).to.equal(1);
    expect(await nfToken.ownerOf(id1)).to.equal(sara.address);
  });

  it('throws when trying to safe transfers NFT from owner to a smart contract', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await expect(nfToken.connect(bob)['safeTransferFrom(address,address,uint256)'](bob.address, nfToken.address, id1)).to.be.revertedWith('Transaction reverted: function selector was not recognized and there\'s no fallback function');
  });

  it('correctly safe transfers NFT from owner to smart contract that can receive NFTs', async function() {
    const tokenReceiverContract = await ethers.getContractFactory('NFTokenReceiverTestMock');
    const tokenReceiver = await tokenReceiverContract.deploy();
    await tokenReceiver.deployed();

    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(bob)['safeTransferFrom(address,address,uint256)'](bob.address, tokenReceiver.address, id1);
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(tokenReceiver.address)).to.equal(1);
    expect(await nfToken.ownerOf(id1)).to.equal(tokenReceiver.address);
  });

  it('correctly safe transfers NFT from owner to smart contract that can receive NFTs with data', async function() {
    const tokenReceiverContract = await ethers.getContractFactory('NFTokenReceiverTestMock');
    const tokenReceiver = await tokenReceiverContract.deploy();
    await tokenReceiver.deployed();

    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.connect(bob)['safeTransferFrom(address,address,uint256,bytes)'](bob.address, tokenReceiver.address, id1, '0x01')).to.emit(nfToken, 'Transfer');
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(tokenReceiver.address)).to.equal(1);
    expect(await nfToken.ownerOf(id1)).to.equal(tokenReceiver.address);
  });

  it('correctly burns a NFT', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    expect(await nfToken.connect(owner).burn(id1)).to.emit(nfToken, 'Transfer');
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    await expect(nfToken.ownerOf(id1)).to.be.revertedWith('003002');
  });

  it('throws when trying to burn non existent NFT', async function() {
    await expect(nfToken.connect(owner).burn(id1)).to.be.revertedWith('003002');
  });

  // it.only('safeTransfer does not call onERC721Received to constructing contract', async function() {
  //   const sendsToSelfOnConstructContract = await ethers.getContractFactory('SendsToSelfOnConstruct');
  //   const sendsToSelfOnConstruct = await sendsToSelfOnConstructContract.deploy();
  //   expect(await sendsToSelfOnConstruct.deployed().deployTransaction).to.emit(sendsToSelfOnConstructContract, 'Transfer');

  //   console.log('here');
  //   // console.log(log);
  //   // console.log(sendsToSelfOnConstruct); No Receive event, 2x Transfer
  // });

});
