/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
/**
 * @class IRepeatable
 * @since v1.0.0
 * @description Interface that describes a semantics ruleset.
 */
export interface IRepeatable {
  /**
   * @description List of transaction types that should or must
   * be bundled with the entry being configured.
   */
  bundleWith: number[],
 
   /**
    * @description The minimum number of appearances of an entry.
    */
  minOccurences: number,
 
   /**
    * @description The maximum number of appearances of an entry.
    */
  maxOccurences: number,
}
