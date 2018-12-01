import { APIGatewayProxyResult } from 'aws-lambda';
import { ErrorResponse } from '../constants/interfaces';

export class BadRequestError extends Error {}

export const createErrorResponseBody = (message: string): ErrorResponse => {
  return {
    Error: true,
    ErrorMessage: message,
  };
};

export const createErrorResponse = (message: string): APIGatewayProxyResult => {
  return {
    statusCode: 400,
    body: JSON.stringify(createErrorResponseBody(message)),
  };
};
