/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
// internal dependencies
import { IRepeatable } from './IRepeatable'

/**
 * @class SemanticRuleset
 * @since v1.0.0
 * @description Class that describes a default semantics ruleset.
 */
export class SemanticRuleset implements IRepeatable {
  /**
   * @description List of transaction types that should or must
   * be bundled with the entry being configured.
   */
  public bundleWith: number[] = []

  /**
   * @description The minimum number of appearances of an entry.
   */
  public minOccurences: number = 0

  /**
   * @description The maximum number of appearances of an entry.
   */
  public maxOccurences: number = 0

  public constructor(
    /**
     * @description Permits overwrite of expected bundled types.
     */
    bundleWith: number[] = [],

    /**
     * @description Permits overwrite of the minimum number of
     * appearances. This property is forced to be greater than
     * or equal to 0.
     */
    minOccurences: number = 0,

    /**
     * @description Permits overwrite of the maximum number of
     * appearances. This property is forced to be greater than
     * or equal to 0.
     */
    maxOccurences: number = 0,
  ) {
    this.bundleWith = bundleWith

    // Forces greater or equal to 0
    this.minOccurences = minOccurences < 0 ? 0 : minOccurences

    // Ensures "max" is greater than or equal to "min"
    this.maxOccurences = maxOccurences < 0 ? 0 : (
      maxOccurences < this.minOccurences 
        ? this.minOccurences
        : maxOccurences
    )
  }

  /**
   * Returns whether a bundle is repeatable or not. This method
   * uses the property `maxOccurences` to determine this value.
   *
   * @return  {boolean}     Whether the bundle can appear more than once.
   */
  public get repeatable(): boolean {
    return this.maxOccurences === 0 || this.maxOccurences > 1
  }
}
