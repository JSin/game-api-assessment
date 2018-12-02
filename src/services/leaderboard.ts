import { lessThan } from '@aws/dynamodb-expressions';
import db from '../util/db';
import { BadRequestError } from '../util/error';
import {
  ScorePostRequest,
  ScorePostResponse,
  LeaderboardEntries,
  LeaderboardGetResponse,
  LeaderboardGetRequest,
} from '../constants/interfaces';
import { Leaderboard } from '../models';
import { ErrorNamesDynamoDB } from '../constants/enums';

export const updateLeaderboardScore = async (userScore: ScorePostRequest): Promise<ScorePostResponse> => {
  let pastScore: Leaderboard;
  try {
    pastScore = await db.get(
      Object.assign(new Leaderboard(), { LeaderboardId: userScore.LeaderboardId, UserId: userScore.UserId }),
    );
  } catch (e) {
    if (e.name !== ErrorNamesDynamoDB.ItemNotFoundException) {
      console.error(e);
      throw e;
    }
  }

  if (pastScore === undefined || pastScore.Score < userScore.Score) {
    const leaderboardModel = new Leaderboard();
    leaderboardModel.LeaderboardId = userScore.LeaderboardId;
    leaderboardModel.UserId = userScore.UserId;
    leaderboardModel.Score = userScore.Score;

    let condition;
    if (pastScore !== undefined) {
      condition = {
        ...lessThan(userScore.Score),
        subject: 'Score',
      };
    }

    try {
      // TODO: skip version check as condition should handle conflicts.
      // Due to the lack of time to test the feature I am making a note here.
      await db.put(leaderboardModel, {
        condition,
      });
    } catch (e) {
      // If ConditionalCheckFailedException happens it means you somehow posted
      // two high scores at the same time. Anyways to be safe I let the DB check for conflicts.
      if (e.name !== ErrorNamesDynamoDB.ConditionalCheckFailedException) {
        console.error(e);
        throw e;
      }
    }
  }

  try {
    let rank = 0;
    for await (const record of db.query(
      Leaderboard,
      { LeaderboardId: userScore.LeaderboardId },
      { indexName: 'ScoreIndex', scanIndexForward: false },
    )) {
      rank += 1;
      if (record.UserId === userScore.UserId) {
        return {
          UserId: record.UserId,
          LeaderboardId: record.LeaderboardId,
          Score: record.Score,
          Rank: rank,
        };
      }
    }
  } catch (e) {
    console.error(e);
  }

  throw new Error();
};

export const getLeaderboardEntries = async (leadboardInfo: LeaderboardGetRequest): Promise<LeaderboardGetResponse> => {
  try {
    await db.get(
      Object.assign(new Leaderboard(), { LeaderboardId: leadboardInfo.LeaderboardId, UserId: leadboardInfo.UserId }),
    );
  } catch (e) {
    throw new BadRequestError('Could not find user');
  }
  let rank = 0;
  const entries: LeaderboardEntries[] = [];
  let userObject: ScorePostResponse;
  const lastRank = leadboardInfo.Offset + leadboardInfo.Limit;
  try {
    for await (const record of db.query(
      Leaderboard,
      { LeaderboardId: leadboardInfo.LeaderboardId },
      { indexName: 'ScoreIndex', scanIndexForward: false },
    )) {
      rank += 1;
      if (record.UserId === leadboardInfo.UserId) {
        userObject = {
          UserId: record.Score,
          LeaderboardId: record.LeaderboardId,
          Score: record.Score,
          Rank: rank,
        };
      }
      if (rank > leadboardInfo.Offset && rank <= lastRank) {
        entries.push({
          UserId: record.UserId,
          Score: record.Score,
          Rank: rank,
        });
      }
      if (userObject !== undefined && rank >= lastRank) {
        break;
      }
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
  return {
    ...userObject,
    Entries: entries,
  };
};
