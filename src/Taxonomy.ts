/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
// internal dependencies
import { AggregateTransaction } from './Transactions';
import { TaxonomyMap, TaxonomyMapEntry } from './TaxonomyMap'
import { SemanticsMap } from './SemanticsMap'
import { SemanticRuleset } from './Semantics/SemanticRuleset'

/**
 * @class Taxonomy
 * @since v1.0.0
 * @description Class that describes specifications for transaction
 *              sequences. This class serves as a ruleset to create
 *              valid/verifiable digital contracts using Symbol.
 *
 * @example How to create a transaction taxonomy
 *
 * ```javascript
 * import { Taxonomy, TaxonomyMap } from '@ubcdigital/symbol-taxonomy'
 * import {
 *   AggregateTransaction,
 *   TransactionType as TType,
 * } from 'symbol-sdk'
 *
 * cont taxonomy = new Taxonomy(
 *   'UBCDigital.NamedAssetCreation',
 *   new TaxonomyMap([
 *      [0, { type: TType.NAMESPACE_REGISTRATION, required: true }],
 *      [1, { type: TType.MOSAIC_DEFINITION, required: true }],
 *      [2, { type: TType.MOSAIC_SUPPLY_CHANGE, required: false }],
 *      [3, { type: TType.TRANSFER, required: true }],
 *   ])
 * )
 *
 * const aggregate = AggregateTransaction.createComplete(...)
 * const isValid = taxonomy.validate(aggregate)
 * ```
 */
export class Taxonomy {

  /**
   * @access protected
   * @description List of unique transaction types registered
   * in a transaction taxonomy.
   */
  protected registeredTypes: number[] = []

  /**
   * Construct a specification object
   *
   * @param   {string}  name  Name of the transaction taxonomy.
   */
  public constructor(
    /**
     * @access public
     * @description Name of the transaction taxonomy.
     */
    public name: string,

    /**
     * @access public
     * @description The minimal transaction sequence planning.
     * This property is used to define a list of required items
     * that will *always* be present in the resulting contract.
     */
    public sequence: TaxonomyMap = new TaxonomyMap(),

    /**
     * @access public
     * @description The potential semantic rulesets to further
     * qualify the transaction sequence planning. This is what
     * defines whether entries can be repeated, how many times
     * and in which subgroups an entry may appear.
     */
    public semantics: SemanticsMap = new SemanticsMap(),
  ) {
    this.registeredTypes = this.getTransactionTypes()
  }

  /**
   * Validates the content of \a contract aggregate transaction
   * by interpreting its' embedded transactions.
   *
   * @access public
   * @param   {PublicAccount}           actor
   * @param   {Array<ContractOption>}    argv
   * @return  {AllowanceResult}
   */
  public validate(
    contract: AggregateTransaction,
  ): boolean {
    // - Do not accept empty contracts
    if (! contract.innerTransactions.length) {
      return false
    }
    // - Do not accept empty sequences
    else if (!this.registeredTypes.length) {
      return  false
    }

    // - Prepares sequenced transactions loop
    const indexes = [...this.sequence.keys()],
          ctrTxes = contract.innerTransactions

    // - Loops through *contract* to validate *types*.
    for (let i = 0, max = ctrTxes.length; i < max; i++) {
      const innerTx = ctrTxes[i]
      if (!this.acceptsType(innerTx.type)) {
        return false
      }
    }

    // - Loops through *sequence* to validate the *structure*.
    for (let i = 0, skip = 0, bundled = 0, max = indexes.length; i < max; i++) {
      // - Reads sequence information and semantics
      const entry = this.sequence.get(i) as TaxonomyMapEntry
      const ruleset = this.semantics.get(i) as SemanticRuleset

      // - Keeps track of required embedded transactions
      const cursor= i - skip + bundled

      let innerTx = cursor < ctrTxes.length
        ? ctrTxes[cursor]
        : null

      // - 1. Repeatable entries are validated in bundles
      if (!!ruleset) {
        // - Prepare the entries bundle
        let trxes = contract.innerTransactions.slice(cursor),
            bundle = [entry]
        for (let b = 1; b < ruleset.bundleWith.length; b++) {
          bundle.push(this.sequence.get(i + b)!)
        }

        // - Uses semantics to validate bundle
        const numOccurences: number = this.semantics.countBundles(
          ruleset,
          bundle,
          trxes,
          this.sequence.get(i + bundle.length)!
        )

        // - Required entries that are repeatable *must* appear
        // - Subzero occurences means validation *must stop*
        if (true === entry.required && !numOccurences || numOccurences < 0) {
          return false
        }

        // - Move cursor depending on bundle size
        i = i + bundle.length
        bundled += numOccurences * bundle.length
      }

      // - 2. Optional entries *can* appear
      else if (false === entry.required) {
        if (!innerTx || innerTx.type !== entry.type)
          skip++

        continue
      }

      // - 3. Required entries *must* appear
      else if (
        !ctrTxes[cursor] || entry.type !== ctrTxes[cursor].type
      ) {
        return false
      }
    }

    return true
  }

  /**
   * This method returns the unique transaction types
   * that must- or can be present in taxonomies which
   * comply to the current taxonomy.
   *
   * @access public
   * @return {number[]}   The alphabetically ordered number
   *                      representations of types. Using a
   *                      sequence the types are expressed:
   *                      e.g. transfer=16724, mosaic=16717
   */
  public getTransactionTypes(): number[] {
    let uniqTypes: {[key: number]: boolean} = {};

    [...this.sequence.values()].forEach(
      (cur, i, arr) => {
        if (!uniqTypes[cur.type]) uniqTypes[cur.type] = true
      }
    )

    return Object.keys(uniqTypes).map(k => parseInt(k))
  }

  /**
   * This method checks whether \a type is a registered
   * transaction type and whether contracts that comply
   * to this taxonomy do "accept" a specific type.
   *
   * @param   {number}   type 
   * @return  {boolean} 
   */
  public acceptsType(
    type: number | undefined
  ): boolean {
    return !!type 
      && this.registeredTypes.length > 0
      && this.registeredTypes.includes(type)
  }
}
