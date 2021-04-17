/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
import {expect} from 'chai'
import {describe, it} from 'mocha'

// internal dependencies
import * as Lib from '../index'

describe('main should', () => {
  it('export Taxonomy', () => {
    expect(Lib.Taxonomy).not.to.be.undefined
  })
})
