import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { createErrorResponse, BadRequestError } from '../util/error';
import { parseBody } from '../util/parseBody';
import { updateLeaderboardScore, getLeaderboardEntries } from '../services/leaderboard';
import { LeaderboardGetRequest } from '../constants/interfaces';

export const createLeaderboardScore: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  let leaderboard;
  try {
    leaderboard = parseBody(event.body);
  } catch (e) {
    return createErrorResponse('Malformed Request');
  }
  if (!Object.values(leaderboard).every(Number.isInteger)) {
    return createErrorResponse('Malformed Request');
  }
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await updateLeaderboardScore(leaderboard)),
    };
  } catch (e) {
    if (e instanceof BadRequestError) {
      return createErrorResponse(e.message);
    }
    return createErrorResponse('Oooops. Something went wrong');
  }
};

export const leaderboardGet: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  let leaderboard: LeaderboardGetRequest;
  try {
    leaderboard = parseBody(event.body);
  } catch (e) {
    return createErrorResponse('Malformed Request');
  }
  if (
    !Object.values(leaderboard).every(Number.isInteger) ||
    leaderboard.Limit === undefined ||
    leaderboard.Limit <= 0 ||
    leaderboard.Offset === undefined ||
    leaderboard.Offset < 0
  ) {
    return createErrorResponse('Malformed Request');
  }
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await getLeaderboardEntries(leaderboard)),
    };
  } catch (e) {
    if (e instanceof BadRequestError) {
      return createErrorResponse(e.message);
    }
    return createErrorResponse('Oooops. Something went wrong');
  }
};
