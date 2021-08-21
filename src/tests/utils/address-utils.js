const { expect } = require('chai');

describe('address utils', function() {
  let addressUtils, owner;

  beforeEach(async () => {
    const addressUtilsContract = await ethers.getContractFactory('AddressUtilsMock');
    addressUtils = await addressUtilsContract.deploy();
    [ owner ] = await ethers.getSigners();
    await addressUtils.deployed();
  });

  it('correctly checks account', async function() {
    expect(await addressUtils.isContract(owner.address)).to.equal(false);
  });

  it('correctly checks smart contract', async function() {
    const contract = await ethers.getContractFactory('NFTokenTestMock');
    const nfToken = await contract.deploy();
    await nfToken.deployed();
    expect(await addressUtils.isContract(nfToken.address)).to.equal(true);
  });
});
