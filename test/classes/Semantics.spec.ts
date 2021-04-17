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
import { Transaction, TransactionType } from 'symbol-sdk'

// internal dependencies
import { OptionalEntry, RequiredEntry, SemanticsMap } from '../../index'
import { getTestTransaction } from '../mocks'

describe('SemanticsMap --->', () => {
  describe('constructor() should', () => {
    it('set empty sequence given no value', () => {
      const semantics = new SemanticsMap([])
      expect(semantics.size).to.not.be.undefined
      expect(semantics.size).to.be.equal(0)
    })
  })

  describe('countBundles() should', () => {
    let semantics: SemanticsMap,
        theBundle = [
          { type: TransactionType.TRANSFER, required: true },
        ]
    before(() => {
      semantics = new SemanticsMap([
        [0, new OptionalEntry()] // true=repeatable
      ])
    })

    it('signal invalidity (-1) given invalid follow-up transaction', () => {
      let failTransactions = [
            getTestTransaction(TransactionType.NAMESPACE_REGISTRATION),
            getTestTransaction(TransactionType.MOSAIC_DEFINITION),
          ],
          theBundle = [
            { type: TransactionType.NAMESPACE_REGISTRATION, required: true },
          ],
          theFollowUp = { type: TransactionType.TRANSFER, required: true }

      let numOccurences = semantics.countBundles(
        semantics.get(0)!,
        theBundle,
        failTransactions,
        theFollowUp,
      )

      expect(numOccurences).to.not.be.undefined
      expect(numOccurences).to.be.equal(-1)
    })

    it('signal invalidity (-2) given too few bundles', () => {
      let failSemantics1 = new SemanticsMap([[0, new RequiredEntry([], 2)]]),
          failSemantics2 = new SemanticsMap([[0, new RequiredEntry([], 3)]]),
          // 1 occurence
          failTransactions1 = [getTestTransaction(TransactionType.TRANSFER)],
          // 2 occurences
          failTransactions2 = [getTestTransaction(TransactionType.TRANSFER), getTestTransaction(TransactionType.TRANSFER)]

      let failOccurences1 = failSemantics1.countBundles(failSemantics1.get(0)!, theBundle, failTransactions1)
      let failOccurences2 = failSemantics2.countBundles(failSemantics2.get(0)!, theBundle, failTransactions1)
      let failOccurences3 = failSemantics2.countBundles(failSemantics2.get(0)!, theBundle, failTransactions2)

      expect(failOccurences1).to.not.be.undefined
      expect(failOccurences1).to.be.equal(-2)
      expect(failOccurences2).to.be.equal(-2)
      expect(failOccurences3).to.be.equal(-2)
    })

    it('signal invalidity (-2) given too many bundles', () => {
      let failSemantics1 = new SemanticsMap([[0, new RequiredEntry([], 1)]]),
          failSemantics2 = new SemanticsMap([[0, new RequiredEntry([], 2)]]),
          // 2 occurences
          failTransactions1 = [getTestTransaction(TransactionType.TRANSFER), getTestTransaction(TransactionType.TRANSFER)],
          // 3 occurences
          failTransactions2 = [getTestTransaction(TransactionType.TRANSFER), getTestTransaction(TransactionType.TRANSFER), getTestTransaction(TransactionType.TRANSFER)]

      let failOccurences1 = failSemantics1.countBundles(failSemantics1.get(0)!, theBundle, failTransactions1)
      let failOccurences2 = failSemantics2.countBundles(failSemantics2.get(0)!, theBundle, failTransactions2)

      expect(failOccurences1).to.not.be.undefined
      expect(failOccurences1).to.be.equal(-2)
      expect(failOccurences2).to.be.equal(-2)
    })

    it('return correct number of appearances given n bundles', () => {
      for (let i = 0; i < 10; i++) {
        let validSemantics = new SemanticsMap([[0, new RequiredEntry([], 0, i+1)]]),
            validTransactions = []
        for (let j = 0; j < i+1; j++) {
          validTransactions.push(getTestTransaction(TransactionType.TRANSFER))
        }

        let numOccurences = validSemantics.countBundles(validSemantics.get(0)!, theBundle, validTransactions)
        expect(numOccurences).to.be.equal(i+1)
      }
    })

    it('return 0 given no appearance of bundle', () => {
      let validSemantics = new SemanticsMap([[0, new OptionalEntry([], 1)]]),
          validTransactions: Transaction[] = []

      let numOccurences = validSemantics.countBundles(validSemantics.get(0)!, theBundle, validTransactions)
      expect(numOccurences).to.be.equal(0)
    })
  })
})
