<p align="center"><img src="https://ubc.digital/wp-content/uploads/2021/04/logo-using-blockchain.png" width="192"></p>

# @ubcdigital/symbol-taxonomy

[![npm-badge][npm-badge]][npm-url]
[![size-badge][size-badge]][npm-url]
[![dl-badge][dl-badge]][npm-url]
[![Build Status](https://travis-ci.com/UsingBlockchain/symbol-taxonomy.svg?branch=main)](https://travis-ci.com/UsingBlockchain/symbol-taxonomy)

This repository contains the source code for **@ubcdigital/symbol-taxonomy**, an open standard for defining transaction taxonomies and semantics on top of Symbol from NEM, and compatible networks.

- [Reference documentation][ref-docs]
- [Introduction](#introduction)
- [Installation](#installation)
- [Sponsor Us](#sponsor-us)
- [Disclaimer](#disclaimer)
- [Licensing](#license)

## Introduction

This library empowers the definition of transaction taxonomies using Symbol from NEM and compatible networks.

This package can be used to further define metadata around *specific transaction groups and occurences* within aggregate transaction on Symbol from NEM and other compatible blockchain networks.

Through easily accessible *Typescript classes*, we make it hereby possible to **define semantics rulesets** around Symbol from NEM blockchain network transactions. This library makes use of the *bundling* nature of aggregate transactions to define in-aggregate *ordering*, *appearance* and *repeating* rules.

Developers that use this library may define their own transaction taxonomies. We do not impose any rules around which type of transactions can be bundled or not. This package exports a class `Taxonomy` that can be extended as needed.

Also, it is worth noting that this package does *not* prepare transaction and *must* only be used to *verify* and/or *validate* aggregate transactions that have been 1) prepared for announcement or 2) announced to the network.

## Installation

`npm i -g @ubcdigital/symbol-taxonomy`

## Sponsor us

| Platform | Sponsor Link |
| --- | --- |
| Paypal | [https://paypal.me/usingblockchainltd](https://paypal.me/usingblockchainltd) |
| Patreon | [https://patreon.com/usingblockchainltd](https://patreon.com/usingblockchainltd) |
| Github | [https://github.com/sponsors/UsingBlockchain](https://github.com/sponsors/UsingBlockchain) |

## Donations / Pot de vin

Donations can also be made with cryptocurrencies and will be used for running the project!

    NEM      (XEM):     NB72EM6TTSX72O47T3GQFL345AB5WYKIDODKPPYW
    Symbol   (XYM):     NDQALDK4XWLOUYKPE7RDEWUI25YNRQ7VCGXMPCI
    Ethereum (ETH):     0x7a846fd5Daa4b904caF7C59f866bb906153305D2
    Bitcoin  (BTC):     3EVqgUqYFRYbf9RjhyjBgKXcEwAQxhaf6o

## Disclaimer

  *The author of this package cannot be held responsible for any loss of money or any malintentioned usage forms of this package. Please use this package with caution.*

  *Our software contains links to the websites of third parties (“external links”). As the content of these websites is not under our control, we cannot assume any liability for such external content. In all cases, the provider of information of the linked websites is liable for the content and accuracy of the information provided. At the point in time when the links were placed, no infringements of the law were recognisable to us..*

## License

Copyright 2020-2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom, All rights reserved.

Licensed under the [AGPL v3 License](LICENSE).

[ref-docs]: https://symbol-taxonomy.symbol.ninja/

[npm-url]: https://www.npmjs.com/package/@ubcdigital/symbol-taxonomy
[npm-badge]: https://img.shields.io/npm/v/@ubcdigital/symbol-taxonomy
[size-badge]: https://img.shields.io/bundlephobia/min/@ubcdigital/symbol-taxonomy
[dl-badge]: https://img.shields.io/npm/dt/@ubcdigital/symbol-taxonomy
