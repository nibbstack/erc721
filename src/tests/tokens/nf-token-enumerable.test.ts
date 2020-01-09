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
  id2?: string;
  id3?: string;
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
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('id3', '125');
});

spec.beforeEach(async (ctx) => {
  const nfToken = await ctx.deploy({ 
    src: './build/nf-token-enumerable-test-mock.json',
    contract: 'NFTokenEnumerableTestMock',
  });
  ctx.set('nfToken', nfToken);
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const nftokenInterface = await nftoken.instance.methods.supportsInterface('0x80ac58cd').call();
  const nftokenEnumerableInterface = await nftoken.instance.methods.supportsInterface('0x780e9d63').call();
  const nftokenNonExistingInterface = await nftoken.instance.methods.supportsInterface('0x5b5e139f').call();
  ctx.is(nftokenInterface, true);
  ctx.is(nftokenEnumerableInterface, true);
  ctx.is(nftokenNonExistingInterface, false);
});

spec.test('correctly mints a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  const logs = await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
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

  await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id2).send({ from: owner });
  await nftoken.instance.methods.mint(sara, id3).send({ from: owner });

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

  await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.tokenByIndex(1).call(), '005007');
});

spec.test('returns the correct token of owner by index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id2).send({ from: owner });
  await nftoken.instance.methods.mint(sara, id3).send({ from: owner });

  const tokenOwnerIndex1 = await nftoken.instance.methods.tokenOfOwnerByIndex(bob, 1).call();
  ctx.is(tokenOwnerIndex1, id2);
});

spec.test('throws when trying to get token of owner by non-existing index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '005007');
});

spec.test('mint should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id3).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id2).send({ from: owner });

  const idToOwnerIndexId1 = await nftoken.instance.methods.idToOwnerIndexWrapper(id1).call();
  const idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  const idToOwnerIndexId2 = await nftoken.instance.methods.idToOwnerIndexWrapper(id2).call();
  ctx.is(idToOwnerIndexId1, '0');
  ctx.is(idToOwnerIndexId3, '1');
  ctx.is(idToOwnerIndexId2, '2');

  const ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  const ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  const ownerToIdsSecond = await nftoken.instance.methods.ownerToIdbyIndex(bob, 1).call();
  const ownerToIdsThird = await nftoken.instance.methods.ownerToIdbyIndex(bob, 2).call();
  ctx.is(ownerToIdsLenPrior, '3');
  ctx.is(ownerToIdsFirst, id1);
  ctx.is(ownerToIdsSecond, id3);
  ctx.is(ownerToIdsThird, id2);

  const idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id1).call();
  const idToIndexSecond = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  const idToIndexThird = await nftoken.instance.methods.idToIndexWrapper(id2).call();

  ctx.is(idToIndexFirst, '0');
  ctx.is(idToIndexSecond, '1');
  ctx.is(idToIndexThird, '2');
});

spec.test('burn should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id3).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id2).send({ from: owner });

  //burn id1
  await nftoken.instance.methods.burn(id1).send({ from: owner });

  let idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  let idToOwnerIndexId2 = await nftoken.instance.methods.idToOwnerIndexWrapper(id2).call();
  ctx.is(idToOwnerIndexId3, '1');
  ctx.is(idToOwnerIndexId2, '0');

  let ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  let ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  let ownerToIdsSecond = await nftoken.instance.methods.ownerToIdbyIndex(bob, 1).call();
  ctx.is(ownerToIdsLenPrior, '2');
  ctx.is(ownerToIdsFirst, id2);
  ctx.is(ownerToIdsSecond, id3);

  let idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id2).call();
  let idToIndexSecond = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  ctx.is(idToIndexFirst, '0');
  ctx.is(idToIndexSecond, '1');

  let tokenIndexFirst = await nftoken.instance.methods.tokenByIndex(0).call();
  let tokenIndexSecond = await nftoken.instance.methods.tokenByIndex(1).call();
  ctx.is(tokenIndexFirst, id2);
  ctx.is(tokenIndexSecond, id3);

  //burn id2
  await nftoken.instance.methods.burn(id2).send({ from: owner });

  idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  ctx.is(idToOwnerIndexId3, '0');

  ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  ctx.is(ownerToIdsLenPrior, '1');
  ctx.is(ownerToIdsFirst, id3);

  idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  ctx.is(idToIndexFirst, '0');

  tokenIndexFirst = await nftoken.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndexFirst, id3);

  //burn id3
  await nftoken.instance.methods.burn(id3).send({ from: owner });

  idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  ctx.is(idToOwnerIndexId3, '0');

  ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  ctx.is(ownerToIdsLenPrior.toString(), '0');

  await ctx.throws(() => nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call());

  idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  ctx.is(idToIndexFirst, '0');
});

spec.test('transfer should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.mint(bob, id1).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id3).send({ from: owner });
  await nftoken.instance.methods.mint(bob, id2).send({ from: owner });
  await nftoken.instance.methods.transferFrom(bob, sara, id1).send({ from: bob });;

  const idToOwnerIndexId1 = await nftoken.instance.methods.idToOwnerIndexWrapper(id1).call();
  const idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  const idToOwnerIndexId2 = await nftoken.instance.methods.idToOwnerIndexWrapper(id2).call();
  ctx.is(idToOwnerIndexId1, '0');
  ctx.is(idToOwnerIndexId3, '1');
  ctx.is(idToOwnerIndexId2, '0');

  let ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  let ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  let ownerToIdsSecond = await nftoken.instance.methods.ownerToIdbyIndex(bob, 1).call();
  ctx.is(ownerToIdsLenPrior, '2');
  ctx.is(ownerToIdsFirst, id2);
  ctx.is(ownerToIdsSecond, id3);

  await ctx.throws(() => nftoken.instance.methods.ownerToIdbyIndex(bob, 2).call());
  
  ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(sara).call();
  ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(sara, 0).call();
  ctx.is(ownerToIdsLenPrior, '1');
  ctx.is(ownerToIdsFirst, id1);
});