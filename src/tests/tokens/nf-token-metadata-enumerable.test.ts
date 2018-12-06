import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  nfToken?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
  id2: string;
  id3?: string;
  uri1?: string;
  uri2?: string;
  uri3?: string;
}

/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '1');
  ctx.set('id2', '2');
  ctx.set('id3', '3');
  ctx.set('uri1', 'http://0xcert.org/1');
  ctx.set('uri2', 'http://0xcert.org/2');
  ctx.set('uri3', 'http://0xcert.org/3');
});

spec.beforeEach(async (ctx) => {
  const nfToken = await ctx.deploy({ 
    src: './build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['Foo','F']
  });
  ctx.set('nfToken', nfToken);
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const nftokenInterface = await nftoken.instance.methods.supportsInterface('0x80ac58cd').call();
  const nftokenMetadataInterface = await nftoken.instance.methods.supportsInterface('0x5b5e139f').call();
  const nftokenEnumerableInterface = await nftoken.instance.methods.supportsInterface('0x780e9d63').call();
  ctx.is(nftokenInterface, true);
  ctx.is(nftokenMetadataInterface, true);
  ctx.is(nftokenEnumerableInterface, true);
});

spec.test('returns the correct issuer name', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const name = await nftoken.instance.methods.name().call();

  ctx.is(name, "Foo");
});

spec.test('returns the correct issuer symbol', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const symbol = await nftoken.instance.methods.symbol().call();

  ctx.is(symbol, "F");
});

spec.test('returns the correct NFT id 1 url', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const uri1 = ctx.get('uri1');

  await nftoken.instance.methods.mint(bob, id1, uri1).send({ from: owner });
  const tokenURI = await nftoken.instance.methods.tokenURI(id1).call();
  ctx.is(tokenURI, uri1);
});

spec.test('throws when trying to get URI of invalid NFT ID', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.instance.methods.tokenURI(id1).call());
});

spec.test('correctly mints a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const uri1 = ctx.get('uri1');

  const logs = await nftoken.instance.methods.mint(bob, id1, uri1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);
  const count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '1');
  const totalSupply = await nftoken.instance.methods.totalSupply().call();
  ctx.is(totalSupply.toString(), '1');
});

spec.test('returns the correct token by index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const uri1 = ctx.get('uri1');
  const uri2 = ctx.get('uri2');
  const uri3 = ctx.get('uri3');

  await nftoken.instance.methods.mint(bob, id1, uri1).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id2, uri2).send({ from: owner });
  await nftoken.instance.methods.mint(sara, id3, uri3).send({ from: owner });

  const tokenIndex0 = await nftoken.instance.methods.tokenByIndex(0).call();
  const tokenIndex1 = await nftoken.instance.methods.tokenByIndex(1).call();
  const tokenIndex2 = await nftoken.instance.methods.tokenByIndex(2).call();
  
  ctx.is(tokenIndex0, id1);
  ctx.is(tokenIndex1, id2);
  ctx.is(tokenIndex2, id3);
});

spec.test('throws when trying to get token by non-existing index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const uri1 = ctx.get('uri1');

  await nftoken.instance.methods.mint(bob, id1, uri1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.tokenByIndex(1).call());
});

spec.test('returns the correct token of owner by index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const uri1 = ctx.get('uri1');
  const uri2 = ctx.get('uri2');
  const uri3 = ctx.get('uri3');

  await nftoken.instance.methods.mint(bob, id1, uri1).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id2, uri2).send({ from: owner });
  await nftoken.instance.methods.mint(sara, id3, uri3).send({ from: owner });

  const tokenOwnerIndex1 = await nftoken.instance.methods.tokenOfOwnerByIndex(bob, 1).call();
  ctx.is(tokenOwnerIndex1, id2);
});

spec.test('throws when trying to get token of owner by non-existing index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const uri1 = ctx.get('uri1');

  await nftoken.instance.methods.mint(bob, id1, uri1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.tokenOfOwnerByIndex(bob, 1).call());
});

spec.test('corectly burns a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const uri1 = ctx.get('uri1');

  await nftoken.instance.methods.mint(bob, id1, uri1).send({ from: owner });
  const logs = await nftoken.instance.methods.burn(id1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const balance = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(balance, '0');
  await ctx.reverts(() => nftoken.instance.methods.ownerOf(id1).call());
  await ctx.reverts(() => nftoken.instance.methods.tokenByIndex(0).call());
  await ctx.reverts(() => nftoken.instance.methods.tokenOfOwnerByIndex(bob, 0).call());
});
