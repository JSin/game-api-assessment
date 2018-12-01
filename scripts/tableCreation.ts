import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import Transaction from '../src/models/transaction';
import TransactionStats from '../src/models/transactionStats';

let options: DynamoDB.Types.ClientConfiguration = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const dataMapper = new DataMapper({
  client: new DynamoDB(options),
});

const initTables = async () => {
  const readWriteCapacity = {
    readCapacityUnits: 2,
    writeCapacityUnits: 2,
  };
  try {
    await dataMapper.ensureTableExists(Transaction, readWriteCapacity);
    console.log('Transaction table exists');
    await dataMapper.ensureTableExists(TransactionStats, readWriteCapacity);
    console.log('TransactionStats table exists');
  } catch (e) {
    console.error(e.message);
  }
};

initTables();
