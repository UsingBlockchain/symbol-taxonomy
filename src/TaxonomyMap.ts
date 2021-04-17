/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
/**
* @class TaxonomyMapEntry
* @since v1.0.0
* @description Interface that describes a transaction sequence entry.
*/
export interface TaxonomyMapEntry {
  /**
  * @description The entry's expected transaction type.
  */
  type: number,

  /**
  * @description Whether this entry is require or not.
  */
  required: boolean,
}

/**
* @class TaxonomyMap
* @since v1.0.0
* @description Class that describes an indexed transaction sequence.
*/
export class TaxonomyMap extends Map<number, TaxonomyMapEntry> {}
