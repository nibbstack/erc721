import { Spec } from '@specron/spec';

interface Data {
  addressUtils?: any;
  owner?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const addressUtils = await ctx.deploy({
    src: './build/address-utils-mock.json',
    contract: 'AddressUtilsMock',
  });
  ctx.set('addressUtils', addressUtils);
});

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
});

spec.test('correctly checks account', async (ctx) => {
  const addressUtils = ctx.get('addressUtils');
  const owner = ctx.get('owner');
  const isContract = await addressUtils.instance.methods.isContract(owner).call();
  ctx.false(isContract);
});

spec.test('correctly checks smart contract', async (ctx) => {
  const addressUtils = ctx.get('addressUtils');
  const nfToken = await ctx.deploy({ 
    src: './build/nf-token-test-mock.json',
    contract: 'NFTokenTestMock',
  });
  const isContract = await addressUtils.instance.methods.isContract(nfToken.receipt._address).call();
  ctx.true(isContract);
});

export default spec;
