import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

@table('Leaderboard')
class Leaderboard {
  @hashKey({
    indexKeyConfigurations: {
      ScoreIndex: 'HASH',
    },
  })
  LeaderboardId: number;

  @rangeKey()
  UserId: number;

  @attribute({
    indexKeyConfigurations: {
      ScoreIndex: 'RANGE',
    },
  })
  Score: number;
}

export default Leaderboard;
