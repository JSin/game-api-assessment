import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { createErrorResponse, BadRequestError } from '../util/error';
import { parseBody } from '../util/parseBody';
import { saveTransaction, getTransacationStatsByUserId } from '../services/transaction';

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
    return createErrorResponse('Oooops. Something went wrong');
  }
};
