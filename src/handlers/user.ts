import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { createErrorResponse, BadRequestError } from '../util/error';
import { parseBody } from '../util/parseBody';
import { saveTransaction, getTransacationStatsByUserId } from '../services/transaction';
import { UserSaveRequest, UserLoadRequest } from '../constants/interfaces';
import { saveUserData, getUserData } from '../services/user';

export const transactionRecording: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  let transaction;
  try {
    transaction = parseBody(event.body);
  } catch (e) {
    return createErrorResponse('Malformed Request');
  }
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await saveTransaction(transaction)),
    };
  } catch (e) {
    if (e instanceof BadRequestError) {
      return createErrorResponse(e.message);
    }
    console.error(e);
    return createErrorResponse('Oooops. Something went wrong');
  }
};

export const transactionStats: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  let tranStats;
  try {
    tranStats = parseBody(event.body);
  } catch (e) {
    return createErrorResponse('Malformed Request');
  }
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await getTransacationStatsByUserId(tranStats)),
    };
  } catch (e) {
    if (e instanceof BadRequestError) {
      return createErrorResponse(e.message);
    }
    console.error(e);
    return createErrorResponse('Oooops. Something went wrong');
  }
};

export const userSave: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  let userSaveRequest: UserSaveRequest;
  try {
    userSaveRequest = parseBody(event.body);
  } catch (e) {
    return createErrorResponse('Malformed Request');
  }
  if (!Number.isInteger(userSaveRequest.UserId)) {
    return createErrorResponse('Malformed Request');
  }
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await saveUserData(userSaveRequest)),
    };
  } catch (e) {
    if (e instanceof BadRequestError) {
      return createErrorResponse(e.message);
    }
    console.error(e);
    return createErrorResponse('Oooops. Something went wrong');
  }
};

export const userLoad: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  let userLoadRequest: UserLoadRequest;
  try {
    userLoadRequest = parseBody(event.body);
  } catch (e) {
    return createErrorResponse('Malformed Request');
  }
  if (!Number.isInteger(userLoadRequest.UserId)) {
    return createErrorResponse('Malformed Request');
  }
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await getUserData(userLoadRequest)),
    };
  } catch (e) {
    if (e instanceof BadRequestError) {
      return createErrorResponse(e.message);
    }
    console.error(e);
    return createErrorResponse('Oooops. Something went wrong');
  }
};
