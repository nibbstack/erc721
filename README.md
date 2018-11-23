![Build Status](https://travis-ci.org/0xcert/ethereum-erc721.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/@0xcert%2Fethereum-erc721.svg)](https://www.npmjs.com/package/@0xcert/ethereum-erc721)&nbsp;[![Dependencies Status](https://david-dm.org/0xcert/ethereum-erc721.svg)](https://david-dm.org/0xcert/ethereum-erc721)&nbsp;[![Bug Bounty](https://img.shields.io/badge/bounty-closed-2930e8.svg)](https://github.com/0xcert/ethereum-erc721/issues/46)

# ERC-721 Token

This is a complete implementation of the [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) non-fungible token standard for the Ethereum blockchain. This is an open source project built with [Truffle](http://truffleframework.com) framework.

Purpose of this implementation is to provide a good starting point for anyone who wants to use and develop non-fungible tokens on the Ethereum blockchain. Instead of re-implementing the ERC-721 yourself you can use this code which has gone through multiple audits and we hope it will be extensively used by the community in the future.

If you are looking for a more feature-rich and advanced ERC721 implementation, then check out the [Xcert repository](https://github.com/0xcert/ethereum-xcert).

## Structure

Since this is a Truffle project, you will find all tokens in `contracts/tokens/` directory. There are multiple implementations and you can select between:
- `NFToken.sol`: This is the base ERC-721 token implementation (with the support for ERC-165).
- `NFTokenEnumerable.sol`: This implements optional ERC-721 support for enumeration. It is useful if you want to know the total supply of tokens, to query a token by index, etc.
- `NFTokenMetadata.sol`: This implements optional ERC-721 metadata features for the token contract. It implements a token name, a symbol and a distinct URI pointing to a publicly exposed ERC-721 JSON metadata file.

Other files in the directory starting with `ERC*.sol` are interfaces and define the respective standards.

## Requirements

* NodeJS 9.0+ recommended.
* Windows, Linux or Mac OS X.

## Installation

### NPM

This is an [NPM](https://www.npmjs.com/package/@0xcert/ethereum-erc721) module for [Truffle](http://truffleframework.com) framework. In order to use it as a dependency in your Javascript project, you must install it through the `npm` command:

```
$ npm install @0xcert/ethereum-erc721
```

### Source

Clone the repository and install the required `npm` dependencies:

```
$ git clone git@github.com:0xcert/ethereum-erc721.git
$ cd ethereum-erc721
$ npm install
```

Make sure that everything has been set up correctly:

```
$ npm run test
```

## Usage

### NPM

To interact with package's contracts within JavaScript code, you simply need to require that package's .json files:

```js
const contract = require("@0xcert/ethereum-erc721/build/contracts/NFTokenEnumerable.json");
console.log(contract);
```

### Source

#### Creating smart contract

The easiest way to start is to create a new file under `contracts/tokens/` (e.g. `MyNFToken.sol`):

```sol
pragma solidity ^0.4.23;

import "../tokens/NFTokenMetadata.sol";
import "../ownership/Ownable.sol";

contract MyNFToken is
  NFTokenMetadata,
  Ownable
{

  constructor(
    string _name,
    string _symbol
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
  }

  function mint(
    address _owner,
    uint256 _id
  )
    onlyOwner
    external
  {
    super._mint(_owner, _id);
  }

  function burn(
    address _owner,
    uint256 _tokenId
  )
    onlyOwner
    external
  {
    super._burn(_owner, _tokenId);
  }

}
```

That's it. Let's compile the contract:

```
$ npm run compile
```

The easiest way to deploy it locally and start interacting with the contract (minting and transferring tokens) is to deploy it on your personal (local) blockchain using [Ganache](http://truffleframework.com/ganache/). Follow the steps in the Truffle documentation which are described [here](http://truffleframework.com/docs/getting_started/project#alternative-migrating-with-ganache).

#### Deploying on testnet (Ropsten)

Next step is to deploy the contract on the testnet.

Requirements:
- [geth](https://geth.ethereum.org/downloads/)
- Wallet with some ether.

Create a new file `migrations/2_mytoken_migration.js` and put in:

```js
const MyNFTokenContract = artifacts.require('./tokens/MyNFToken.sol');

module.exports = function(deployer) {
  deployer.deploy(MyNFTokenContract, 'MyNFTokenTest', 'MYNFT');
};
```

Start `geth` and sync your client with the testnet (can take a little bit):

```
$ geth console --testnet --light --rpc --rpcaddr "localhost" --rpcport "8545" --rpccorsdomain "*" --rpcapi="db,eth,net,web3,personal,web3"
```

Open another terminal and create a new account (your "test" account wallet):

```
$ geth --testnet account new
```

**NOTE**: In this example the wallet address is  `0x9062dd79d7e4273889b234f6b0c840ca43280af60x9` (make sure you prepend the returned string with `0x` yourself). Your account address will be different! And don't forget the passphrase otherwise you won't be able to unlock your new account. Now, go and send some ether to it (you can get some [here](https://faucet.metamask.io/).

Open project's `truffle.js` and add the following:

```js
module.exports = {
  networks: {
    'ropsten': {
      host: 'localhost',
      port: 8545,
      network_id: '3', // Ropsten ID 3
      from: '0x9062dd79d7e4273889b234f6b0c840ca43280af60x9', // account address from which to deploy
      gas: 4000000,
    },
  },
};
```

Next, let's unlock your account:

```
$ npm run console -- --network ropsten
```

```
truffle(ropsten)> web3.personal.unlockAccount("0x9062dd79d7e4273889b234f6b0c840ca43280af6", "<PASSWORD>", 1500)
```

At last, deploy the contract:

```
$ npm run migrate -- --network ropsten
```

You can now interact with the contract. First get the address of the deployed contract:

```
$ npm run networks
```

You can also check it on Ropsten [etherscan](https://ropsten.etherscan.io/address/0xb9e5d21cbc8620956d539c274f938951788f51ae). Then in the truffle console (second terminal):

```
> const { abi } = require('./build/contracts/MyNFToken.json');
> const account0 = '0x9062dd79d7e4273889b234f6b0c840ca43280af60x9'; // your unlocked account
> const account1 = '0x294a4c90900c0dae6ce8e3329a2b219a1f3d8c22'; // another account (you can create it)
> const MyNFTokenContract = web3.eth.contract(abi);
> const MyNFTokenInstance = MyNFTokenContract.at(<MyNFToken ADDRESS>);

> MyNFTokenInstance.symbol();
'MYNFT'
> MyNFTokenInstance.name();
'MyNFToken'
> MyNFTokenInstance.balanceOf(account0).toString();
'0' <-- we don't have any NFTokens yet

> MyNFTokenInstance.mint(account0, '1234', { from: account0 });
'0xd919e28be93d3a597fe8bf8516457f105d47836001dce3e22df7663dc1c5a6ed'
> MyNFTokenInstance.mint(account0, '5678', { from: account0 });
'0x964d082d88f7f4db91e41430b53d5473249470a6823f14fc8d5c3979adb550aa'
> MyNFTokenInstance.balanceOf(account0).toString();
'2' <-- Now we have 2!

> MyNFTokenInstance.burn(account0, '5678', { from: account0 });
> '0xb2b4eede6793212ac2d085d0d1121ce78da26513dc8c3503dc4faadc2f771f58'
> MyNFTokenInstance.balanceOf(account0).toString();
'1'
> MyNFTokenInstance.safeTransferFrom(account0, account1, '1234', { from: account0 });
'0x81b9b353855c4b8c9b8b4d82c4dc8bbfa2de0dd5e6d6d94831b459b1bf0dc7b3'
> MyNFTokenInstance.balanceOf(account0).toString();
'0'
> MyNFTokenInstance.balanceOf(account1).toString();
'1'
```

## Playground

We already deployed some contracts to [Ropsten](https://ropsten.etherscan.io/) network. You can play with them RIGHT NOW. No need to install software. In this test version of the contract, anybody can `mint` or `burn` tokens, so don't use it for anything important.

| Contract | Token address | Transaction hash
|-|-|-
| NFToken | [0xdf8f576057f2f19f8cae4f7ae155a0ee66c05f24](https://ropsten.etherscan.io/address/0xdf8f576057f2f19f8cae4f7ae155a0ee66c05f24) | [0x665a0dc54b707e6cf354b2521368452ee11c19939b18d60d1df2649ef2a996be](https://ropsten.etherscan.io/tx/0x665a0dc54b707e6cf354b2521368452ee11c19939b18d60d1df2649ef2a996be)
| NFTokenEnumerable | [0xde0fb829c3562ec9ec68cb4fed1015ee81b81feb](https://ropsten.etherscan.io/address/0xde0fb829c3562ec9ec68cb4fed1015ee81b81feb) | [0xb520fceed5284c8d08611dca3768c69f23e5475d3d6b49cfbaa5105b5eeca54a](https://ropsten.etherscan.io/tx/0xb520fceed5284c8d08611dca3768c69f23e5475d3d6b49cfbaa5105b5eeca54a)
| NFTokenMetadata | [0xa3cdc8acd916d99104ab5428bc26372d0039cc86](https://ropsten.etherscan.io/address/0xa3cdc8acd916d99104ab5428bc26372d0039cc86) | [0xbe1d72cd7f8e5865b3b6f7f95b72019733d8a2f897ff483b212de0a79f01aa40](https://ropsten.etherscan.io/tx/0xbe1d72cd7f8e5865b3b6f7f95b72019733d8a2f897ff483b212de0a79f01aa40)
| NFTokenMetadataEnumerable | [0x7cc392789d2c0cc61377a26cf4dd181095b402a5](https://ropsten.etherscan.io/address/0x7cc392789d2c0cc61377a26cf4dd181095b402a5) | [0xe706840e18c43b32a9f33dead9495e961ad91aaaa0ee4f2aa866726ea33c95ea](https://ropsten.etherscan.io/tx/0xe706840e18c43b32a9f33dead9495e961ad91aaaa0ee4f2aa866726ea33c95ea)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](./LICENSE) for details.
