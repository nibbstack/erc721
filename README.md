![Build Status](https://travis-ci.org/0xcert/ethereum-erc721.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/@0xcert%2Fethereum-erc721.svg)](https://www.npmjs.com/package/@0xcert/ethereum-erc721)&nbsp;[![Dependencies Status](https://david-dm.org/0xcert/ethereum-erc721.svg)](https://david-dm.org/0xcert/ethereum-erc721)&nbsp;[![Bug Bounty](https://img.shields.io/badge/bounty-closed-2930e8.svg)](https://github.com/0xcert/ethereum-erc721/issues/46)

# ERC-721 Token — Reference Implementation

This is the complete reference implementation of the [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) non-fungible token standard for the Ethereum blockchain. This is an open source project, complete with [Specron](https://specron.github.io/framework/) testing.

Purpose of this implementation is to provide a good starting point for anyone who wants to use and develop non-fungible tokens on the Ethereum blockchain. Instead of re-implementing the ERC-721 yourself you can use this code which has gone through multiple audits and we hope it will be extensively used by the community in the future.

If you are looking for a more feature-rich and advanced ERC721 implementation, then check out the [Xcert repository](https://github.com/0xcert/ethereum-xcert).

## Structure

All contracts and tests are in the [src](src/) folder. There are multiple implementations and you can select between:

- [`nf-token.sol`](src/contracts/tokens/nf-token.sol): This is the base ERC-721 token implementation (with support for ERC-165).
- [`nf-token-metadata.sol`](src/contracts/tokens/nf-token-metadata.sol): This implements optional ERC-721 support for enumeration. It is useful if you want to know the total supply of tokens, to query a token by index, etc.
- [`nf-token-enumerable.sol`](src/contracts/tokens/nf-token-enumerable.sol): This implements optional ERC-721 metadata features for the token contract. It implements a token name, a symbol and a distinct URI pointing to a publicly exposed ERC-721 JSON metadata file.

Other files in the [tokens](src/contracts/tokens) and [utils](src/contracts/utils) directories named like `erc*.sol` are interfaces and define the respective standards.

## Requirements

* NodeJS 9.0+ is supported
* Windows, Linux or macOS

## Installation

### npm

*This is the recommended installation method if you want to use this package in your own JavaScript project.*

This project is [released as an npm module](https://www.npmjs.com/package/@0xcert/ethereum-erc721). You must install it using the `npm` command:

```
$ npm install @0xcert/ethereum-erc721
```

### Source

*This is the recommended installation method if you want to improve the `0xcert/ethereum-erc721` project.*

Clone this repository and install the required `npm` dependencies:

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

### npm

To interact with this package's contracts within JavaScript code, you simply need to require this package's `.json` files:

```js
const contract = require("@0xcert/ethereum-erc721/build/nf-token-enumerable.json");
console.log(contract);
```

### Remix IDE

You can quickly deploy a contract with this library using [Remix IDE](https://remix.ethereum.org). Here is one example.

You have created and have possession of unique glass-blown artwork (each having a serial number / lot number) which you would like to sell using Ethereum mainnet. You will sell non-fungible tokens and the buyers would be able to trade those to other people. One token per piece of artwork. You commit to anybody holding these tokens that they may redeem there token and take physical posession of the art.

To do this, simply paste the code belowe into Remix and deploy the smart contract. You will "mint" a token for each new piece of artwork you want to see. Then you will "burn" that token when you surrender physical possession of the piece.

```solidity
pragma solidity ^0.5.1;
import "github.com/0xcert/ethereum-erc721/src/contracts/mocks/nf-token-metadata-mock.sol";

/**
 * @dev This is an example contract implementation of NFToken with metadata extension.
 */
contract MyArtSale is
  NFTokenMetadata,
  Ownable
{
  constructor()
    public
  {
    nftName = "Frank's Art Sale";
    nftSymbol = "FAS";
  }

  /**
   * @dev Mints a new NFT.
   * @param _to The address that will own the minted NFT.
   * @param _tokenId of the NFT to be minted by the msg.sender.
   * @param _uri String representing RFC 3986 URI.
   */
  function mint(
    address _to,
    uint256 _tokenId,
    string calldata _uri
  )
    external
    onlyOwner
  {
    super._mint(_to, _tokenId);
    super._setTokenUri(_tokenId, _uri);
  }

  /**
   * @dev Removes a NFT from owner.
   * @param _tokenId Which NFT we want to remove.
   */
  function burn(
    uint256 _tokenId
  )
    external
    onlyOwner
  {
    super._burn(_tokenId);
  }

}
```

*You should contact a lawyer before holding an auction, or selling anything really. Specifically, laws for auctions vary wildly by jurisdiction. This application is provided only as an example of the technology and is not legal advice.*

## Playground

We already deployed some contracts to [Ropsten](https://ropsten.etherscan.io/) network. You can play with them RIGHT NOW. No need to install software. In this test version of the contract, anybody can `mint` or `burn` tokens, so don't use it for anything important.

| Contract                                                     | Token address | Transaction hash |
| ------------------------------------------------------------ | ------------- | ---------------- |
| [`nf-token.sol`](src/contracts/tokens/nf-token.sol)          | TODO          | TODO             |
| [`nf-token-metadata.sol`](src/contracts/tokens/nf-token-metadata.sol) | TODO          | TODO             |
| [`nf-token-enumerable.sol`](src/contracts/tokens/nf-token-enumerable.sol) | TODO          | TODO             |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](./LICENSE) for details.
