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
 
 // internal dependencies
import { OptionalEntry, RequiredEntry, SemanticRuleset } from '../../index'

describe('SemanticRuleset --->', () => {
  describe('constructor() should', () => {
    it('permit overwrite of property \’bundleWith\’', () => {
      const ruleset1 = new SemanticRuleset([0, 1])
      const ruleset2 = new SemanticRuleset([0, 1, 2, 3, 4])
      expect(ruleset1.bundleWith).to.not.be.undefined
      expect(ruleset1.bundleWith.length).to.be.equal(2)
      expect(ruleset1.bundleWith).to.be.deep.equal([0, 1])
      expect(ruleset2.bundleWith).to.be.deep.equal([0, 1, 2, 3, 4])
    })

    it('permit overwrite of property \'minOccurences\’', () => {
      const ruleset1 = new SemanticRuleset([], 0)
      const ruleset2 = new SemanticRuleset([], 1)
      const ruleset3 = new SemanticRuleset([], 2)
      expect(ruleset1.minOccurences).to.be.equal(0)
      expect(ruleset2.minOccurences).to.be.equal(1)
      expect(ruleset3.minOccurences).to.be.equal(2)
    })

    it('overwrite property \'minOccurences\’ given less than 0', () => {
      const ruleset1 = new SemanticRuleset([], -1)
      expect(ruleset1.minOccurences).to.be.equal(0)
    })

    it('permit overwrite of property \'maxOccurences\’', () => {
      const ruleset1 = new SemanticRuleset([], 0, 1)
      const ruleset2 = new SemanticRuleset([], 1, 2)
      const ruleset3 = new SemanticRuleset([], 2, 3)
      expect(ruleset1.maxOccurences).to.be.equal(1)
      expect(ruleset2.maxOccurences).to.be.equal(2)
      expect(ruleset3.maxOccurences).to.be.equal(3)
    })

    it('overwrite property \'maxOccurences\’ given less than 0', () => {
      const ruleset1 = new SemanticRuleset([], 0, -1)
      expect(ruleset1.maxOccurences).to.be.equal(0)
    })

    it('overwrite property \'maxOccurences\’ given less than \'minOccurences\'', () => {
      const ruleset1 = new SemanticRuleset([], 1, 0)
      const ruleset2 = new SemanticRuleset([], 1, 1)
      expect(ruleset1.maxOccurences).to.be.equal(1)
      expect(ruleset2.maxOccurences).to.be.equal(1)
    })
  })

  describe('repeatable() should', () => {
    it('should return true given \'maxOccurences\' equal to 0', () => {
      const ruleset = new SemanticRuleset([], 0, 0)
      expect(ruleset.repeatable).to.not.be.undefined
      expect(ruleset.repeatable).to.be.equal(true)
    })

    it('should return false given \'maxOccurences\' equal to 1', () => {
      const ruleset = new SemanticRuleset([], 0, 1)
      expect(ruleset.repeatable).to.not.be.undefined
      expect(ruleset.repeatable).to.be.equal(false)
    })

    it('should return true given \'maxOccurences\' greater than 1', () => {
      const ruleset1 = new SemanticRuleset([], 0, 2)
      const ruleset2 = new SemanticRuleset([], 0, 3)
      const ruleset3 = new SemanticRuleset([], 0, 10)
      expect(ruleset1.repeatable).to.not.be.undefined
      expect(ruleset1.repeatable).to.be.equal(true)
      expect(ruleset2.repeatable).to.be.equal(true)
      expect(ruleset3.repeatable).to.be.equal(true)
    })
  })
})

describe('OptionalEntry --->', () => {
  describe('constructor() should', () => {
    it('permit overwrite of property \’bundleWith\’', () => {
      const ruleset1 = new OptionalEntry([0, 1])
      const ruleset2 = new OptionalEntry([0, 1, 2, 3, 4])
      expect(ruleset1.bundleWith).to.not.be.undefined
      expect(ruleset1.bundleWith.length).to.be.equal(2)
      expect(ruleset1.bundleWith).to.be.deep.equal([0, 1])
      expect(ruleset2.bundleWith).to.be.deep.equal([0, 1, 2, 3, 4])
    })

    it('permit overwrite of property \'maxOccurences\’', () => {
      const ruleset1 = new OptionalEntry([], 1)
      const ruleset2 = new OptionalEntry([], 2)
      const ruleset3 = new OptionalEntry([], 3)
      expect(ruleset1.maxOccurences).to.be.equal(1)
      expect(ruleset2.maxOccurences).to.be.equal(2)
      expect(ruleset3.maxOccurences).to.be.equal(3)
    })

    it('overwrite property \'maxOccurences\’ given less than 0', () => {
      const ruleset1 = new OptionalEntry([], -1)
      expect(ruleset1.maxOccurences).to.be.equal(0)
    })
  })
})

describe('RequiredEntry --->', () => {
  describe('constructor() should', () => {
    it('permit overwrite of property \’bundleWith\’', () => {
      const ruleset1 = new RequiredEntry([0, 1])
      const ruleset2 = new RequiredEntry([0, 1, 2, 3, 4])
      expect(ruleset1.bundleWith).to.not.be.undefined
      expect(ruleset1.bundleWith.length).to.be.equal(2)
      expect(ruleset1.bundleWith).to.be.deep.equal([0, 1])
      expect(ruleset2.bundleWith).to.be.deep.equal([0, 1, 2, 3, 4])
    })

    it('permit overwrite of property \'minOccurences\’', () => {
      const ruleset1 = new SemanticRuleset([], 0)
      const ruleset2 = new SemanticRuleset([], 1)
      const ruleset3 = new SemanticRuleset([], 2)
      expect(ruleset1.minOccurences).to.be.equal(0)
      expect(ruleset2.minOccurences).to.be.equal(1)
      expect(ruleset3.minOccurences).to.be.equal(2)
    })

    it('overwrite property \'minOccurences\’ given less than 0', () => {
      const ruleset1 = new SemanticRuleset([], -1)
      expect(ruleset1.minOccurences).to.be.equal(0)
    })

    it('permit overwrite of property \'maxOccurences\’', () => {
      const ruleset1 = new RequiredEntry([], 0, 1)
      const ruleset2 = new RequiredEntry([], 1, 2)
      const ruleset3 = new RequiredEntry([], 2, 3)
      expect(ruleset1.maxOccurences).to.be.equal(1)
      expect(ruleset2.maxOccurences).to.be.equal(2)
      expect(ruleset3.maxOccurences).to.be.equal(3)
    })

    it('overwrite property \'maxOccurences\’ given less than 0', () => {
      const ruleset1 = new RequiredEntry([], 0, -1)
      expect(ruleset1.maxOccurences).to.be.equal(0)
    })
  })
})
