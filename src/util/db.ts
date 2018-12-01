import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

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

export default dataMapper;
