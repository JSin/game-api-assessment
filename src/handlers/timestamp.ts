import { APIGatewayProxyHandler } from 'aws-lambda';

export const unixTimeMs: APIGatewayProxyHandler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      Timestamp: Date.now(),
    }),
  };
};
