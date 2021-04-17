/**
 * This file is part of @ubcdigital/symbol-taxonomy shared under AGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     @ubcdigital/symbol-taxonomy
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     AGPL-3.0
 */
import {
  AggregateTransaction,
  Deadline,
  InnerTransaction,
  NetworkType,
  TransactionType,
  Transaction,
} from 'symbol-sdk'

export const getTestAggregateTransaction = (
  transactions: InnerTransaction[] = []
): AggregateTransaction => {
  return AggregateTransaction.createComplete(
    Deadline.create(1),
    transactions,
    NetworkType.MAIN_NET,
    [],
  )
}

export const getTestTransaction = (
  type: TransactionType = TransactionType.TRANSFER
): Transaction => {
  return { type } as Transaction
}
