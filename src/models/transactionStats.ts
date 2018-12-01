import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

@table('TransactionStats')
class TransactionStats {
  @hashKey()
  UserId: number;

  @attribute()
  TransactionCount: number;

  @attribute()
  CurrencySum: number;
}

export default TransactionStats;
