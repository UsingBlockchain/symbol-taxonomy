/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
// internal dependencies
import { SemanticRuleset } from './SemanticRuleset'

/**
 * @class OptionalEntry
 * @since v1.0.0
 * @description Class that describes a semantics ruleset that
 * refers to an optional entry in a taxonomy. Optional entries
 * can be left empty in the validated aggregate transactions.
 */
export class OptionalEntry extends SemanticRuleset {
  public constructor(
    /**
     * @description Permits overwrite of expected bundled types.
     */
    bundleWith: number[] = [],

    /**
     * @description Permits overwrite of the maximum number of
     * appearances. This property is forced to be greater than
     * or equal to 0.
     */
    maxOccurences: number = 0,
  ) {
    super(bundleWith)

    // Ensures optional appearance
    this.minOccurences = 0

    // Ensures "max" is greater than or equal to "min"
    this.maxOccurences = maxOccurences < 0 ? 0 : (
      maxOccurences < this.minOccurences 
        ? this.minOccurences
        : maxOccurences
    )
  }
}
