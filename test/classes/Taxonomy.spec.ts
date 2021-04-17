/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { AggregateTransaction, TransactionType } from 'symbol-sdk'

// internal dependencies
import { OptionalEntry, SemanticsMap, Taxonomy, TaxonomyMap } from '../../index'
import { getTestAggregateTransaction, getTestTransaction } from '../mocks'

describe('Taxonomy --->', () => {
  describe('constructor() should', () => {
    it('set empty sequence given no value', () => {
      const taxonomy = new Taxonomy('Taxonomy.Tests.Taxonomy')
      expect(taxonomy.sequence).to.not.be.undefined
      expect(taxonomy.sequence).to.be.instanceof(TaxonomyMap)
    })
  })

  describe('getTransactionTypes() should', () => {
    it ('return types only once', () => {
      const taxonomy = new Taxonomy('Taxonomy.Tests.TypesOnce', new TaxonomyMap([
        [0, { type: TransactionType.TRANSFER, required: true }],
        [1, { type: TransactionType.TRANSFER, required: true }],
        [2, { type: TransactionType.TRANSFER, required: false }],
        [3, { type: TransactionType.TRANSFER, required: true }],
      ]))

      const types = taxonomy.getTransactionTypes()
      expect(types).to.not.be.undefined
      expect(types.length).to.be.equal(1)
      expect(types[0]).to.be.equal(TransactionType.TRANSFER)
    })

    it ('filter out duplicate types given multiple types', () => {
      const taxonomy = new Taxonomy('Taxonomy.Tests.TypesFilter', new TaxonomyMap([
        [0, { type: TransactionType.TRANSFER, required: true }],
        [1, { type: TransactionType.TRANSFER, required: false }],
        [2, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
      ]))

      let types = taxonomy.getTransactionTypes()

      expect(types).to.not.be.undefined
      expect(types.length).to.be.equal(2)
      // results are alphabetically ordered
      expect(types[0]).to.be.equal(TransactionType.MOSAIC_DEFINITION)
      expect(types[1]).to.be.equal(TransactionType.TRANSFER)
    })

    it ('filter out duplicate types given many types', () => {
      const taxonomy = new Taxonomy('Taxonomy.Tests.TypesFilterAdvanced', new TaxonomyMap([
        [0, { type: TransactionType.TRANSFER, required: true }],
        [1, { type: TransactionType.TRANSFER, required: false }],
        [2, { type: TransactionType.TRANSFER, required: false }],
        [3, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
        [4, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
        [5, { type: TransactionType.NAMESPACE_METADATA, required: true }],
        [6, { type: TransactionType.TRANSFER, required: true }],
        [7, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
        [8, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
        [9, { type: TransactionType.NAMESPACE_METADATA, required: true }],
      ]))

      let types = taxonomy.getTransactionTypes()

      expect(types).to.not.be.undefined
      expect(types.length).to.be.equal(4)
      // results are alphabetically ordered
      expect(types[0]).to.be.equal(TransactionType.MOSAIC_DEFINITION)
      expect(types[1]).to.be.equal(TransactionType.NAMESPACE_REGISTRATION)
      expect(types[2]).to.be.equal(TransactionType.TRANSFER)
      expect(types[3]).to.be.equal(TransactionType.NAMESPACE_METADATA)
    })

    it ('sort transaction type number representations alphabetically', () => {
      const taxonomy = new Taxonomy('Taxonomy.Tests.TypesFilter', new TaxonomyMap([
        // intentional "highest first"
        [0, { type: TransactionType.NAMESPACE_METADATA, required: true }],
        [1, { type: TransactionType.TRANSFER, required: true }],
        [2, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
        [3, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
        [4, { type: TransactionType.SECRET_PROOF, required: true }],
      ]))

      let types = taxonomy.getTransactionTypes()

      expect(types).to.not.be.undefined
      expect(types.length).to.be.equal(5)
      expect(types[0]).to.be.equal(TransactionType.MOSAIC_DEFINITION)
      expect(types[1]).to.be.equal(TransactionType.NAMESPACE_REGISTRATION)
      expect(types[2]).to.be.equal(TransactionType.TRANSFER)
      expect(types[3]).to.be.equal(TransactionType.SECRET_PROOF)
      expect(types[4]).to.be.equal(TransactionType.NAMESPACE_METADATA)
    })
  })

  describe('validate() should', () => {
    let taxonomy: Taxonomy
    before(() => {
      taxonomy = new Taxonomy('Taxonomy.Tests.MiniTaxonomy', new TaxonomyMap([
        [0, { type: TransactionType.MOSAIC_DEFINITION, required: false }],
        [1, { type: TransactionType.TRANSFER, required: true }],
      ]))
    })

    it ('return false given empty contract', () => {
      const failAggregate = getTestAggregateTransaction([])
      expect(taxonomy.validate(failAggregate)).to.be.equal(false)
    })

    it ('return false given empty sequence', () => {
      const failTaxonomy = new Taxonomy('Taxonomy.Tests.FailEmptyTaxonomy', new TaxonomyMap([]))
      const failAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.MOSAIC_DEFINITION)
      ])
      expect(failTaxonomy.validate(failAggregate)).to.be.equal(false)
    })

    it ('return false given missing required entry', () => {
      const failAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.MOSAIC_DEFINITION)
      ])
      expect(taxonomy.validate(failAggregate)).to.be.equal(false)
    })

    it ('return true given missing optional entry', () => {
      const taxonomy_opt = new Taxonomy('Taxonomy.Tests.TaxonomyWithOptionals', new TaxonomyMap([
        [0, { type: TransactionType.TRANSFER, required: false }],
        [1, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
      ]))
      const validAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.MOSAIC_DEFINITION)
      ])
      expect(taxonomy_opt.validate(validAggregate)).to.be.equal(true)
    })

    it ('return true given correct required entry', () => {
      const validAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.TRANSFER)
      ])
      expect(taxonomy.validate(validAggregate)).to.be.equal(true)
    })

    it ('return true given correct required entry after optional entries', () => {
      const taxonomy_extended = new Taxonomy('Taxonomy.Tests.TaxonomyExtended', new TaxonomyMap([
        [0, { type: TransactionType.MOSAIC_DEFINITION, required: false }],
        [1, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: false }],
        [2, { type: TransactionType.TRANSFER, required: true }],
      ]))
      const validAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
        getTestTransaction(TransactionType.TRANSFER)
      ])
      expect(taxonomy_extended.validate(validAggregate)).to.be.equal(true)
    })

    it ('return false given correct required entry after unregistered entry', () => {
      const taxonomy_extended = new Taxonomy('Taxonomy.Tests.TaxonomyExtendedUnregistered', new TaxonomyMap([
        [0, { type: TransactionType.MOSAIC_DEFINITION, required: false }],
        [1, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: false }],
        [2, { type: TransactionType.TRANSFER, required: true }],
      ]))
      const validAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
        getTestTransaction(TransactionType.TRANSFER)
      ])
      expect(taxonomy_extended.validate(validAggregate)).to.be.equal(false)
    })

    it ('return false given correct required entry before unregistered entry', () => {
      const taxonomy_extended = new Taxonomy('Taxonomy.Tests.TaxonomyExtendedUnregistered', new TaxonomyMap([
        [0, { type: TransactionType.MOSAIC_DEFINITION, required: false }],
        [1, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: false }],
        [2, { type: TransactionType.TRANSFER, required: true }],
      ]))
      const validAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.TRANSFER),
        getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
      ])
      expect(taxonomy_extended.validate(validAggregate)).to.be.equal(false)
    })

    it ('return true given all required entries in advanced taxonomy', () => {
      const taxonomy_advanced = new Taxonomy('Taxonomy.Tests.TaxonomyAdvancedRequired', new TaxonomyMap([
        [0, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
        [1, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
        [2, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: false }],
        [3, { type: TransactionType.TRANSFER, required: true }],
        [4, { type: TransactionType.TRANSFER, required: false }],
        [5, { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true }]
      ]))
      const validAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
        getTestTransaction(TransactionType.MOSAIC_DEFINITION),
        getTestTransaction(TransactionType.TRANSFER),
        getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
      ])
      expect(taxonomy_advanced.validate(validAggregate)).to.be.equal(true)
    })

    it ('return true given full sequence in advanced taxonomy', () => {
      const taxonomy_advanced = new Taxonomy('Taxonomy.Tests.TaxonomyAdvancedFull', new TaxonomyMap([
        [0, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
        [1, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
        [2, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: false }],
        [3, { type: TransactionType.TRANSFER, required: true }],
        [4, { type: TransactionType.TRANSFER, required: false }],
        [5, { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true }]
      ]))
      const validAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
        getTestTransaction(TransactionType.MOSAIC_DEFINITION),
        getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
        getTestTransaction(TransactionType.TRANSFER),
        getTestTransaction(TransactionType.TRANSFER),
        getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
      ])
      expect(taxonomy_advanced.validate(validAggregate)).to.be.equal(true)
    })

    it ('return false given missing required entry in advanced taxonomy', () => {
      const taxonomy_advanced = new Taxonomy('Taxonomy.Tests.TaxonomyAdvancedMissing', new TaxonomyMap([
        [0, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
        [1, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
        [2, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: false }],
        [3, { type: TransactionType.TRANSFER, required: true }],
        [4, { type: TransactionType.TRANSFER, required: false }],
        [5, { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true }]
      ]))
      const invalidAggregate = getTestAggregateTransaction([
        getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
        getTestTransaction(TransactionType.MOSAIC_DEFINITION),
        getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
        getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
      ])
      expect(taxonomy_advanced.validate(invalidAggregate)).to.be.equal(false)
    })

    describe('with all required it should', () => {
      let taxonomy_required: Taxonomy,
          valid_aggregate: AggregateTransaction
      before(() => {
        taxonomy_required = new Taxonomy('Taxonomy.Tests.TaxonomyRequired', new TaxonomyMap([
          [0, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
          [1, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
          [2, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: true }],
          [3, { type: TransactionType.TRANSFER, required: true }],
          [4, { type: TransactionType.TRANSFER, required: true }],
          [5, { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true }]
        ]))

        valid_aggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
      })

      it ('return false missing any entry when all are required', () => {
        for (let i = 0, m = valid_aggregate.innerTransactions.length; i < m; i++) {
          const failAggregate = getTestAggregateTransaction(
            // - Removes item at cursor
            valid_aggregate.innerTransactions.slice(0, i).concat(
              valid_aggregate.innerTransactions.slice(i+1)
            )
          )
          expect(taxonomy_required.validate(failAggregate)).to.be.equal(false)
        }
      })

      it ('return true given all entries', () => {
        expect(taxonomy_required.validate(valid_aggregate)).to.be.equal(true)
      })
    })

    describe('with all optional it should', () => {
      let taxonomy_optional: Taxonomy,
          valid_aggregate: AggregateTransaction
      before(() => {
        taxonomy_optional = new Taxonomy('Taxonomy.Tests.TaxonomyOptional', new TaxonomyMap([
          [0, { type: TransactionType.NAMESPACE_REGISTRATION, required: false }],
          [1, { type: TransactionType.MOSAIC_DEFINITION, required: false }],
          [2, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: false }],
          [3, { type: TransactionType.TRANSFER, required: false }],
          [4, { type: TransactionType.TRANSFER, required: false }],
          [5, { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: false }]
        ]))

        // any combination of the above would be valid
        valid_aggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
        ])
      })

      it ('return false given empty contract', () => {
        const failAggregate = getTestAggregateTransaction([])
        expect(taxonomy_optional.validate(failAggregate)).to.be.equal(false)
      })

      it ('return false given unregistered transaction type', () => {
        const failAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.SECRET_LOCK),
        ])
        expect(taxonomy_optional.validate(failAggregate)).to.be.equal(false)
      })

      it ('return true given any listed transaction type', () => {
        expect(taxonomy_optional.validate(valid_aggregate)).to.be.equal(true)
      })
    })

    describe('with semantics it should', () => {
      let taxonomy_semantics: Taxonomy
      before(() => {
        taxonomy_semantics = new Taxonomy('Taxonomy.Tests.Semantical', new TaxonomyMap([
          [0, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
          [1, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
          [2, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: true }],
          [3, { type: TransactionType.TRANSFER, required: false }],
          [4, { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true }]
        ]),
        new SemanticsMap([
          [3, new OptionalEntry()]
        ]))
      })

      it ('return true given none of the repeatable entries', () => {
        const validAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(validAggregate)).to.be.equal(true)
      })

      it ('return true given exactly one of the repeatable entries', () => {
        const validAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(validAggregate)).to.be.equal(true)
      })

      it ('return true given more than one of the repeatable entries', () => {
        const validAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(validAggregate)).to.be.equal(true)
      })

      it ('return true given many of the repeatable entries', () => {
        const validAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(validAggregate)).to.be.equal(true)
      })

      it ('return false given invalid entry in place of repeatable entries', () => {
        const failAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(failAggregate)).to.be.equal(false)
      })

      it ('return false given multiple invalid entries in place of repeatable entries', () => {
        const failAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(failAggregate)).to.be.equal(false)
      })

      it ('return false given one repeatable entry before invalid entries in place of repeatable entries', () => {
        const failAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(failAggregate)).to.be.equal(false)
      })

      it ('return false given one repeatable entry among invalid entries in place of repeatable entries', () => {
        const failAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(failAggregate)).to.be.equal(false)
      })

      it ('return false given one repeatable entry after invalid entries in place of repeatable entries', () => {
        const failAggregate = getTestAggregateTransaction([
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
          getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
          getTestTransaction(TransactionType.TRANSFER),
          getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
        ])
        expect(taxonomy_semantics.validate(failAggregate)).to.be.equal(false)
      })
    })
  })

  // describe('validateBundle() should', () => {
  //   let taxonomy: Taxonomy
  //   before(() => {
  //     taxonomy = new Taxonomy('Taxonomy.Tests.NonRepeatableBundle', new TaxonomyMap([
  //       [0, { type: TransactionType.NAMESPACE_REGISTRATION, required: true }],
  //       [1, { type: TransactionType.MOSAIC_DEFINITION, required: true }],
  //       [2, { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: true }],
  //       [3, { type: TransactionType.TRANSFER, required: false }],
  //       [4, { type: TransactionType.TRANSFER, required: true }],
  //       [5, { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true }],
  //       [6, { type: TransactionType.MOSAIC_ADDRESS_RESTRICTION, required: true }],
  //       [7, { type: TransactionType.TRANSFER, required: true }],
  //     ]),
  //     // testing semantics maps
  //     new SemanticsMap([
  //       [5, { bundleWith: [6], repeatable: false, minOccurences: 1, maxOccurences: 1 }]
  //     ]))
  //   })

  //   it ('return 0 given transaction outside bundle specification', () => {
  //     const failBundle = [
  //       { type: TransactionType.NAMESPACE_REGISTRATION, required: true },
  //       { type: TransactionType.MOSAIC_DEFINITION, required: true },
  //       { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: true },
  //     ]
  //     const failAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.TRANSFER),
  //     ])
  //     expect(taxonomy.validateBundle(failBundle, failAggregate.innerTransactions)).to.be.equal(0)
  //   })

  //   it ('return 0 given incomplete in-contract bundle', () => {
  //     const failBundle = [
  //       { type: TransactionType.NAMESPACE_REGISTRATION, required: true },
  //       { type: TransactionType.MOSAIC_DEFINITION, required: true },
  //       { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: true },
  //     ]
  //     const failAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
  //       getTestTransaction(TransactionType.MOSAIC_DEFINITION),
  //     ])
  //     expect(taxonomy.validateBundle(failBundle, failAggregate.innerTransactions)).to.be.equal(0)
  //   })

  //   it ('return 0 given non-compliant in-contract bundle', () => {
  //     const failBundle = [
  //       { type: TransactionType.NAMESPACE_REGISTRATION, required: true },
  //       { type: TransactionType.MOSAIC_DEFINITION, required: true },
  //       { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: true },
  //     ]
  //     const failAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
  //       getTestTransaction(TransactionType.MOSAIC_DEFINITION),
  //       getTestTransaction(TransactionType.TRANSFER),
  //     ])
  //     expect(taxonomy.validateBundle(failBundle, failAggregate.innerTransactions)).to.be.equal(0)
  //   })

  //   it ('return 1 given exactly one occurrence of bundle specification', () => {
  //     const findBundle = [
  //       { type: TransactionType.NAMESPACE_REGISTRATION, required: true },
  //       { type: TransactionType.MOSAIC_DEFINITION, required: true },
  //       { type: TransactionType.MOSAIC_SUPPLY_CHANGE, required: true },
  //     ]
  //     const validAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
  //       getTestTransaction(TransactionType.MOSAIC_DEFINITION),
  //       getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
  //     ])
  //     expect(taxonomy.validateBundle(findBundle, validAggregate.innerTransactions)).to.be.equal(1)
  //   })

  //   it ('return 1 given exactly one occurrence with one rest transaction', () => {
  //     const findBundle = [
  //       { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true },
  //       { type: TransactionType.MOSAIC_ADDRESS_RESTRICTION, required: true },
  //     ]
  //     const validAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
  //       getTestTransaction(TransactionType.MOSAIC_DEFINITION),
  //       getTestTransaction(TransactionType.MOSAIC_SUPPLY_CHANGE),
  //       getTestTransaction(TransactionType.TRANSFER),
  //       getTestTransaction(TransactionType.TRANSFER),
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.MOSAIC_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.TRANSFER),
  //     ])
  //     expect(taxonomy.validateBundle(findBundle, validAggregate.innerTransactions.slice(5))).to.be.equal(1)
  //   })

  //   it ('return 1 given one occurrence followed by an incomplete occurence', () => {
  //     const findBundle = [
  //       { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true },
  //       { type: TransactionType.MOSAIC_ADDRESS_RESTRICTION, required: true },
  //     ]
  //     const validAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.MOSAIC_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //     ])
  //     expect(taxonomy.validateBundle(findBundle, validAggregate.innerTransactions)).to.be.equal(1)
  //   })

  //   it ('return 1 given one occurrence followed by an invalid occurence', () => {
  //     const findBundle = [
  //       { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true },
  //       { type: TransactionType.MOSAIC_ADDRESS_RESTRICTION, required: true },
  //     ]
  //     const validAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.MOSAIC_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.TRANSFER),
  //     ])
  //     expect(taxonomy.validateBundle(findBundle, validAggregate.innerTransactions)).to.be.equal(1)
  //   })

  //   it ('return 2 given exactly two occurrences of bundle specification', () => {
  //     const findBundle = [
  //       { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true },
  //       { type: TransactionType.MOSAIC_ADDRESS_RESTRICTION, required: true },
  //     ]
  //     const validAggregate = getTestAggregateTransaction([
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.MOSAIC_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.MOSAIC_ADDRESS_RESTRICTION),
  //     ])
  //     expect(taxonomy.validateBundle(findBundle, validAggregate.innerTransactions)).to.be.equal(2)
  //   })

  //   it ('return n given n occurrences of bundle specification', () => {
  //     const findBundle = [
  //       { type: TransactionType.ACCOUNT_ADDRESS_RESTRICTION, required: true },
  //       { type: TransactionType.MOSAIC_ADDRESS_RESTRICTION, required: true },
  //     ]
  //     const bundledTxes = [
  //       getTestTransaction(TransactionType.ACCOUNT_ADDRESS_RESTRICTION),
  //       getTestTransaction(TransactionType.MOSAIC_ADDRESS_RESTRICTION)
  //     ]
  //     for (let i = 1, occurs = i * 2; i < 10; i++) {
  //       let innerTxes: Transaction[] = []
  //       for (let j = 0; j < occurs; j++) {
  //         innerTxes = innerTxes.concat(bundledTxes)
  //       }

  //       expect(taxonomy.validateBundle(findBundle, innerTxes)).to.be.equal(occurs)
  //     }
  //   })
  // })
})
