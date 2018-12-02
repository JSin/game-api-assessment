import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

@table('User')
class User {
  @hashKey()
  UserId: number;

  @attribute()
  Data: any;
}

export default User;
