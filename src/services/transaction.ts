import { createHash } from 'crypto';
import { attributeNotExists, UpdateExpression } from '@aws/dynamodb-expressions';
import { secretKey } from '../constants/user';
import db from '../util/db';
import { BadRequestError } from '../util/error';
import {
  TransactionRequest,
  TransactionStatsRequest,
  TransactionStatsResponse,
  SuccessResponse,
} from '../constants/interfaces';
import { Transaction, TransactionStats } from '../models';
import { ErrorNamesDynamoDB } from '../constants/enums';

export const saveTransaction = async (transaction: TransactionRequest): Promise<SuccessResponse> => {
  if (!isValidTransaction(transaction)) {
    throw new BadRequestError('Invalid Transaction');
  }
  return await saveTransactionInDB(transaction);
};

const saveTransactionInDB = async (transaction: TransactionRequest): Promise<SuccessResponse> => {
  const transModel = new Transaction();
  transModel.TransactionId = transaction.TransactionId;
  transModel.UserId = transaction.UserId;
  transModel.CurrencyAmount = transaction.CurrencyAmount;

  try {
    await db.put(transModel, {
      condition: {
        ...attributeNotExists(),
        subject: 'TransactionId',
      },
    });
    await saveTransactionStats(transaction);
  } catch (e) {
    if (e.name === ErrorNamesDynamoDB.ConditionalCheckFailedException) {
      throw new BadRequestError('Transaction Id already exists');
    }
    console.error(e);
    throw e;
  }

  return {
    Success: true,
  };
};

const isValidTransaction = (transaction: TransactionRequest): boolean => {
  const hashString = `${secretKey}${transaction.TransactionId}${transaction.UserId}${transaction.CurrencyAmount}`;
  const hash = createHash('sha1');
  hash.update(hashString);
  if (hash.digest('hex') === transaction.Verifier) {
    return true;
  }
  return false;
};

const saveTransactionStats = async (transaction: TransactionRequest) => {
  const updateExpression = new UpdateExpression();
  updateExpression.add('TransactionCount', 1);
  updateExpression.add('CurrencySum', transaction.CurrencyAmount);
  try {
    db.executeUpdateExpression(updateExpression, { UserId: transaction.UserId }, TransactionStats);
  } catch (e) {
    // TODO: Throw failed update onto message queue to be processed later.
    console.error('Unable to update transaction stats');
    console.error(e);
  }
};

export const getTransacationStatsByUserId = async (
  tranStats: TransactionStatsRequest,
): Promise<TransactionStatsResponse> => {
  const tranStatsModel = new TransactionStats();
  tranStatsModel.UserId = tranStats.UserId;
  try {
    return await db.get(tranStatsModel);
  } catch (e) {
    if (e.name === ErrorNamesDynamoDB.ResourceNotFoundException) {
      throw new BadRequestError('Invalid User Id');
    }
    console.error(e);
    throw e;
  }
};
