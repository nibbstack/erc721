# Contributing

## Issues

We use GitHub issues to track public bugs. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue.

## Pull requests

* Fork the repo and create your branch from master.
* If you've added code that should be tested, add tests.
* Ensure the test suite passes.

## Coding style

The full style guide is available [here](https://github.com/0xcert/solidity-style-guide).

## Release process

The release manager is responsible to follow this process for each release of this project.

1. Confirm that the [version we reference](https://github.com/0xcert/ethereum-erc721/blob/master/src/contracts/math/safe-math.sol) for SafeMath is the [latest released version](https://github.com/0xcert/framework/tree/master/packages/0xcert-ethereum-utils-contracts/src/contracts/math).
2. Summarize the changes and create a release using [GitHub releases](https://github.com/0xcert/solidity-style-guide/releases).
3. Create a branch/pull request against https://github.com/0xcert/framework/tree/master/packages/0xcert-ethereum-erc721-contracts for any relevant changes since the last release here

```
$ npm i
$ npm test
$ npm publish
```

Note: item 1 may become automated at some point and put into the continuous integration build.
