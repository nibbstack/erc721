import { Spec } from '@specron/spec';

const spec = new Spec();

spec.test('returns boolean', async (ctx) => {
  const main = await ctx.deploy({
    src: './build/main.json',
    contract: 'Main',
  });
  const value = await main.instance.methods.works().call();
  ctx.is(value, '100');
});

export default spec;