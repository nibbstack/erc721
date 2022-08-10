
const { expect } = require('chai');

describe('nf-token-enumerable', function() {
  let nfToken, owner, bob, jane, sara;
  const id1 = 123;
  const id2 = 124;
  const id3 = 125;
  const id4 = 126;

  beforeEach(async () => {
    const nftContract = await ethers.getContractFactory('NFTokenEnumerableTestMock');
    nfToken = await nftContract.deploy(0);
    [ owner, bob, jane, sara] = await ethers.getSigners();
    await nfToken.deployed();
  });

  it('correctly mints a NFT limited by maxSupply', async function() {
    const nftContract = await ethers.getContractFactory('NFTokenEnumerableTestMock');
    nfToken = await nftContract.deploy(3);
    [ owner ] = await ethers.getSigners();
    await nfToken.deployed();

    await nfToken.connect(owner).mint(owner.address, id1);
    await nfToken.connect(owner).mint(owner.address, id2);
    await nfToken.connect(owner).mint(owner.address, id3);

    expect(await nfToken.balanceOf(owner.address)).to.equal(3);
    expect(await nfToken.totalSupply()).to.equal(3);
    expect(await nfToken.getMaxSupply()).to.equal(3);

    await expect(nfToken.connect(owner).mint(owner.address, id4)).to.be.revertedWith('005008');
    expect(await nfToken.totalSupply()).to.equal(3);
    expect(await nfToken.getMaxSupply()).to.equal(3);
  });

  it('correctly checks all the supported interfaces', async function() {
    expect(await nfToken.supportsInterface('0x80ac58cd')).to.equal(true);
    expect(await nfToken.supportsInterface('0x780e9d63')).to.equal(true);
    expect(await nfToken.supportsInterface('0x5b5e139f')).to.equal(false);
  });

  it('correctly mints a NFT', async function() {
    expect(await nfToken.connect(owner).mint(bob.address, id1)).to.emit(nfToken, 'Transfer');
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.totalSupply()).to.equal(1);
    expect(await nfToken.getMaxSupply()).to.equal(1);
  });

  it('returns the correct token by index', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(owner).mint(bob.address, id2);
    await nfToken.connect(owner).mint(bob.address, id3);
    expect(await nfToken.tokenByIndex(0)).to.equal(id1);
    expect(await nfToken.tokenByIndex(1)).to.equal(id2);
    expect(await nfToken.tokenByIndex(2)).to.equal(id3);
    expect(await nfToken.getMaxSupply()).to.equal(3);
  });

  it('throws when trying to get token by non-existing index', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await expect(nfToken.tokenByIndex(1)).to.be.revertedWith('005007');
  });

  it('returns the correct token of owner by index', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(owner).mint(bob.address, id2);
    await nfToken.connect(owner).mint(sara.address, id3);
    expect(await nfToken.tokenOfOwnerByIndex(bob.address, 1)).to.equal(id2);
  });

  it('throws when trying to get token of owner by non-existing index', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await expect(nfToken.tokenOfOwnerByIndex(bob.address, 1)).to.be.revertedWith('005007');
  });

  it('mint should correctly set ownerToIds and idToOwnerIndex and idToIndex', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(owner).mint(bob.address, id3);
    await nfToken.connect(owner).mint(bob.address, id2);

    expect(await nfToken.idToOwnerIndexWrapper(id1)).to.equal(0);
    expect(await nfToken.idToOwnerIndexWrapper(id3)).to.equal(1);
    expect(await nfToken.idToOwnerIndexWrapper(id2)).to.equal(2);
    expect(await nfToken.ownerToIdsLen(bob.address)).to.equal(3);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 0)).to.equal(id1);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 1)).to.equal(id3);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 2)).to.equal(id2);
    expect(await nfToken.idToIndexWrapper(id1)).to.equal(0);
    expect(await nfToken.idToIndexWrapper(id3)).to.equal(1);
    expect(await nfToken.idToIndexWrapper(id2)).to.equal(2);
  });

  it('burn should correctly set ownerToIds and idToOwnerIndex and idToIndex', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(owner).mint(bob.address, id3);
    await nfToken.connect(owner).mint(bob.address, id2);

    //burn id1
    await nfToken.connect(owner).burn(id1);
    expect(await nfToken.idToOwnerIndexWrapper(id3)).to.equal(1);
    expect(await nfToken.idToOwnerIndexWrapper(id2)).to.equal(0);
    expect(await nfToken.ownerToIdsLen(bob.address)).to.equal(2);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 0)).to.equal(id2);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 1)).to.equal(id3);
    expect(await nfToken.idToIndexWrapper(id2)).to.equal(0);
    expect(await nfToken.idToIndexWrapper(id3)).to.equal(1);
    expect(await nfToken.tokenByIndex(0)).to.equal(id2);
    expect(await nfToken.tokenByIndex(1)).to.equal(id3);

    //burn id2
    await nfToken.connect(owner).burn(id2);
    expect(await nfToken.idToOwnerIndexWrapper(id3)).to.equal(0);
    expect(await nfToken.ownerToIdsLen(bob.address)).to.equal(1);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 0)).to.equal(id3);
    expect(await nfToken.idToIndexWrapper(id3)).to.equal(0);
    expect(await nfToken.tokenByIndex(0)).to.equal(id3);

    //burn id3
    await nfToken.connect(owner).burn(id3);
    expect(await nfToken.idToOwnerIndexWrapper(id3)).to.equal(0);
    expect(await nfToken.ownerToIdsLen(bob.address)).to.equal(0);
    await expect(nfToken.ownerToIdbyIndex(bob.address, 0)).to.be.revertedWith('VM Exception while processing transaction: reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)');
    expect(await nfToken.idToIndexWrapper(id3)).to.equal(0);
  });

  it('transfer should correctly set ownerToIds and idToOwnerIndex and idToIndex', async function() {
    await nfToken.connect(owner).mint(bob.address, id1);
    await nfToken.connect(owner).mint(bob.address, id3);
    await nfToken.connect(owner).mint(bob.address, id2);
    await nfToken.connect(bob).transferFrom(bob.address, sara.address, id1);

    expect(await nfToken.idToOwnerIndexWrapper(id1)).to.equal(0);
    expect(await nfToken.idToOwnerIndexWrapper(id3)).to.equal(1);
    expect(await nfToken.idToOwnerIndexWrapper(id2)).to.equal(0);

    expect(await nfToken.ownerToIdsLen(bob.address)).to.equal(2);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 0)).to.equal(id2);
    expect(await nfToken.ownerToIdbyIndex(bob.address, 1)).to.equal(id3);
    await expect(nfToken.ownerToIdbyIndex(bob.address, 2)).to.be.revertedWith('VM Exception while processing transaction: reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)');

    expect(await nfToken.ownerToIdsLen(sara.address)).to.equal(1);
    expect(await nfToken.ownerToIdbyIndex(sara.address, 0)).to.equal(id1);
  });
});
