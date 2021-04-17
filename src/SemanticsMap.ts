/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
// internal dependencies
import { Transaction } from './Transactions';
import { SemanticRuleset } from './Semantics/SemanticRuleset'
import { TaxonomyMapEntry } from './TaxonomyMap'

/**
 * @class SemanticsMap
 * @since v1.0.0
 * @description Class that describes indexed semantic rulesets.
 *
 * @example How to create a semantics map
 *
 * ```javascript
 * import * as Lib from '@ubcdigital/symbol-taxonomy'
 *
 * const semantics = new Lib.SemanticsMap([
 *   [0, Lib.RequiredEntry([], 1, 5)],
 * ])
 * ```
 */
export class SemanticsMap extends Map<number, SemanticRuleset> {
  /**
   * Constructor for a semantics map.
   * @param values 
   */
  public constructor(
    values: Iterable<[number, SemanticRuleset]> = []
  ) {
    super(values)
  }

  /**
   * This method uses a semantic ruleset \a ruleset to validate
   * the presence of a bundle of \a entries in a contract given
   * in \a transactions and possibly followed by \a followedBy.
   *
   * @param   {SemanticRuleset}     ruleset         The semantic ruleset to apply.
   * @param   {TaxonomyMapEntry[]}  entries         The entries representing the bundle.
   * @param   {Transaction[]}       transactions    The sequence of transactions (contract).
   * @param   {TaxonomyMapEntry}    followedBy      (Optional) The entry following the bundle.
   * @returns {number}              The number of appearances or **sub-zero** on invalid contract content.
   */
  public countBundles(
    ruleset: SemanticRuleset,
    entries: TaxonomyMapEntry[],
    transactions: Transaction[],
    followedBy?: TaxonomyMapEntry,
  ): number {
    const numOccurences = this.countBundleAppearances(entries, transactions, followedBy)

    // - In case of unexpected follow-up transaction, send a break signal
    if (numOccurences < 0) {
      return -1
    }

    // - Repeatable entries must be kept within boundaries
    if (! this.validateBoundaries(ruleset, numOccurences)) {
      return -2
    }

    return numOccurences
  }

  /**
   * This method validates the compliancy to \a entries bundles
   * of \a transactions. It will return the number of occurrences
   * of the *full* bundle that were found.
   *
   * @access  protected
   * @param   {TaxonomyMapEntry}    entries       The bundled sequence.
   * @param   {Transaction[]}       transactions  The transactions that may comply.
   * @param   {TaxonomyMapEntry}    followedBy      (Optional) The entry following the bundle.
   * @return  {number}              The number of occurrences of given bundle.
   */
  protected countBundleAppearances(
    entries: TaxonomyMapEntry[],
    transactions: Transaction[],
    followedBy?: TaxonomyMapEntry | undefined,
  ): number {
    let isBundle: boolean = false,
        cntFound: number = 0

    // - Loops through `transactions` in bundled steps
    do {
      const cursor = cntFound * entries.length

      // - Each bundle may contain the same number of entries
      for (let i = 0, m = entries.length; i < m; i++) {
        const bundled = entries[i]
        const innerTx = transactions[cursor + i]

        // - Unexpected transaction types
        if (!innerTx || innerTx.type !== bundled.type) {

          // - In case of a follow-up, we must break
          if (followedBy && innerTx.type !== followedBy.type) {
            return -1
          }

          // - Otherwise, we mark the non-compliancy
          isBundle = false
          break
        }
        // - Ensures bundles are *complete*
        else if (i === entries.length - 1) {
          isBundle = true
        }
      }

      if (isBundle) {
        cntFound++
      }
    }
    while (isBundle === true)

    return cntFound
  }

  /**
   * Validates that a number of occurences satisfies
   * the \a rule semantic ruleset's `minOccurences`
   * and `maxOccurences` boundaries.
   *
   * @access  protected
   * @param   {SemanticRuleset}   rule          The ruleset to use.
   * @param   {number}            numOccurences The number of occurences to validate.
   * @return  {boolean}           Whether the number of occurences is within boundaries.
   */
  protected validateBoundaries(
    rule: SemanticRuleset,
    numOccurences: number = 0,
  ): boolean {
    return numOccurences >= rule.minOccurences && (
      !rule.maxOccurences || numOccurences <= rule.maxOccurences
    )
  }
}
