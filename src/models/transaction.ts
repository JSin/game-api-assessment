import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

@table('Transaction')
class Transaction {
  @hashKey()
  TransactionId: number;

  @attribute()
  UserId: number;

  @attribute()
  CurrencyAmount: number;
}

export default Transaction;
