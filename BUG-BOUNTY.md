# ERC-721 Token Reference Implementation Bug Bounty

*This documents 0xcert's bug bounty process and how you get paid for finding issues with the ERC-721 Token Reference Implementation.*

## Leaderboard

First, let's give credit to the security researchers that reported bugs!

| Bug report                                                   | Severity | Researcher    |
| ------------------------------------------------------------ | -------- | ------------- |
| #51                                                          | Low      | @dafky2000    |
| [`a03db28`#commitcomment-29251894](https://github.com/0xcert/ethereum-erc721/commit/a03db28eb22ad5a3fc17c707152db46166068a1d#commitcomment-29251894) | Low      | @matbest      |
| #87                                                          | Low      | @mg6maciej    |
| #91                                                          | Low      | @mudgen       |
| #97                                                          | Low      | @mg6maciej    |
| #100                                                         | Medium   | @mg6maciej    |
| #102                                                         | Low      | @coburncoburn |
| #106                                                         | High     | @mg6maciej    |

## Sponsors

**Sponsor this bug bounty if you support ERC-721**. This means you will commit to pay researchers that demonstrate a problem. Contact us at [bounty@0xcert.org](mailto:bounty@0xcert.org) if interested. Thank you.

Sponsors: ![0xcert sponsor](https://img.shields.io/badge/0xcert-50,000%20USD-red.svg)![William Entriken sponsor](https://img.shields.io/badge/William%20Entriken-+1,000%20 USD-blue.svg)

Total bounty: ![ERC-721 Bug Bounty](https://img.shields.io/badge/ERC--721%20Bug%20Bounty-51,000%20USD-purple.svg)

---

## Scope of this bounty program

This bounty is open for an unlimited time. A previous limited-time bounty program was:

* [Round 1](https://github.com/0xcert/ethereum-erc721/issues/46) — **2018-05-16 at 00:01 CET** to **2018-07-16 at 23:59 CET**

Help us find any problems with this contract and with ERC-721 in general. This bounty program's function scope includes:

- Overflow or break parts of the implementation
- Steal ownership of a token
- Give a token to somebody else and double spend it or revert it back to your control
- Any undocumented and unintuitive behavior
- Typos
- Style guide violations
- Whitespace errors (yes really)

## Rules and rewards

- Issues that have already been published here or are already disclosed to the 0xcert team are not eligible for rewards (a corollary, the 0xcert team members are ineligible for rewards).
- Social engineering, XKCD#538 attacks, bringing down Mainnet/Infura are not in scope and will NOT be paid a reward.
- Only the end-user contracts (`src/contracts/**/*.sol`) are in scope.
- Only Ethereum mainnet is in scope. We intend to add other blockchains at a future date such as Hyperledger Burrow, Ethereum Classic and POA Network.
- [GitHub Issues](https://github.com/0xcert/ethereum-erc721/issues) is the only way to report issues and request rewards.
- The 0xcert team has complete and final judgement on acceptability of bug reports.
- This program is governed under the laws of the Republic of Slovenia, if there is a party that we are unable to pay due to trade embargoes or other restrictions then we won't pay. But we are happy to cooperate by making alternate arrangements.

Following is a [risk rating model](https://www.owasp.org/index.php/OWASP_Risk_Rating_Methodology) that judges the severity of an issue based on its likelihood and impact.

|                 | LOW LIKELIHOOD  | :left_right_arrow: | HIGH LIKELIHOOD      |
| --------------- | --------------- | ------------------ | -------------------- |
| **HIGH IMPACT** | Medium severity | High severity      | **Highest severity** |
| :arrow_up_down: | Low severity    | Medium severity    | High severity        |
| **LOW IMPACT**  | *Notable*       | Low severity       | Medium severity      |

Rewards:

- **Highest severity** — full payout of the bug bounty (50,000 USD)
- **High severity** — partial payout of the bug bounty (5,000 USD)
- **Medium severity** — partial payout of the bug bounty (1,000 USD)
- **Low severity** — partial payout of the bug bounty (100 USD)
- ***Notable*** — no cash payout
- All eligible reports ("notable" or higher) are mentioned in [the leaderboard](#leaderboard) and are eligible to receive a special bug bounty tee shirt.
- Additional rewards are available from [sponsors](#sponsors). In general these will follow proportionally as the rewards above.
- 0xcert and sponsors reserve the right to deduct from the bounty pledge when payments are made (i.e. a limited "pool"). However we do intend to replenish the to 50,000 USD. This clause allows our sponsors to limit their exposure to a specific amount.

Examples of impact:

- *High impact* — steal a token from someone else, impersonate the contract owner
- *Medium impact* — cause metadata to fail so that the wrong data goes on the blockchain, waste 5,000 gas or more in a transaction (ignoring transfer-to-self and no-op transactions)
- *Low impact* — cause a transaction counterparty that carefully reads the contract documentation to make a mistake on some edge case type of transaction
- *Low impact* — typos, style guide violations, whitespace violations (i.e. undue burden on developers)

Examples of likelihood:

* *High likelihood* — affects all users of the smart contract performing a certain function
* *Medium likelihood* — affects a number of end users in a scenario that actually happens naturally in production deployments
* *Low likelihood* — affects two end users only if they are cooperating together to exploit a specially crafted transaction
* *Low likelihood* — affects developers and grammarians but not end users

How to win:

- Be descriptive and detailed when describing your issue
- Fix it — recommend a way to solve the problem
- Include a Specron test case that we can reproduce

Rules for bounty sponsor:

- We will respond quickly to your questions (within 2 business days)
- We will adjudicate all prizes quickly (within 5 business days)

## More questions

* Are you really recommending [*full disclosure*](https://en.wikipedia.org/wiki/Full_disclosure_(computer_security)) as a best practice?
  * Yes. Blockchain projects based on ERC-20 tokens have reached a peak market capitalization of (XXX billion USD). Well known losses due to problems with ERC-20 have exceeded ([XX million USD in value](https://github.com/ethereum/EIPs/issues/223)). We expect a similar or higher amount of commerce to be done with ERC-721 and this project is the reference implementation. The best defense we can offer to the community is to be transparent when issues come. Following are two references on this topic to explore further.
  * Schneier, Bruce. ["Damned Good Idea"](https://www.schneier.com/essay-146.html). CSO Online. Retrieved 29 April 2013.
  * Heiser, Jay (January 2001). ["Exposing Infosecurity Hype"](https://web.archive.org/web/20060328012516/http://infosecuritymag.techtarget.com/articles/january01/columns_curmudgeons_corner.shtml). *Information Security Mag*. TechTarget. Archived from [the original](http://infosecuritymag.techtarget.com/articles/january01/columns_curmudgeons_corner.shtml) on 28 March 2006. Retrieved 29 April 2013.
  * [:star: Star this repo](https://github.com/0xcert/ethereum-erc721/) if you are using this code. Surely you would want to know of any bugs as soon as possible.
  * If you prefer to send us a bug report privately so that a fix can be developed concurrently with the announcement you are welcome to mail us at [bounty@0xcert.org](mailto:bounty@0xcert.org). You are welcome to make a hashed bug report (set issue body to hash of your message). This will still be eligible for payment and recognition.

* Will things change during the bounty program?
  * Yes, we are seeking sponsors and will add additional prizes here if that happens.
  * Yes, we will update the code and redeploy the contract. So, click [:star: STAR and :eye: WATCH](https://github.com/0xcert/ethereum-erc721/) above on this repo for updates.

- Taxes?
  - If you earn so much money that you will need to fill out a tax form, then we will ask you to fill out a tax form. This whole program is subject to the laws of the Republic of Slovenia.
- I read to the bottom of the file.
  - That's not even a question. Good, you're the type of person we're seeking. Here's a hint, you can see the [CryptoKitties bounty program](https://github.com/axiomzen/cryptokitties-bounty) and [Su Squares bounty program](https://github.com/su-squares/ethereum-contract) and everything that happened there. We stole lots of ideas from them, thank you.

Released under the [MIT License](LICENSE).