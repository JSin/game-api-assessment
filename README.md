# Game like APIs (Technical Assessment)

## Requirements
* NodeJS = 8.10.0
* Docker
* AWS credentials

### Setup (locally)

```sh
# Install node_modules
$ npm install

# Turn on DynamoDB
$ docker run -p 8000:8000 amazon/dynamodb-local

# Set up database. Only works of Linux environment (you could set up cross-env).
$ npm run setup-tables

# Run Lambda locally
$ npx serverless offline start
```

## Assumptions and considerations:
* DynamoDB will save empty strings as null which can be a problem for UserSave if not omitted (which I didn't do here).
* For Timestamp, milliseconds elapsed since UNIX epoch.
* TransactionStats and Transaction can go out of sync. Might be useful to have a global secondary index (GSI) on Transaction table in case you need to verify TransactionStats table. I didn't do that here.
* User currency is capped between -infinity to infinity (I don't have any guards from letting the user from getting negative currency)
* For API 2 and 3, I decided to have two different tables. Logically I believe TransactionStats would be hit often especially because a user needs to know their balance more often than they buy things.
* In the initial design of tables I mapped the queries for each API. I realized that leaderboard rank was difficult to get without a table scan (for both for SQL and noSQL). A table scan can be expensive for a game will millions+ players.
* Not sure of the conflicts that can occur in SHA1. If a malformed request is given where in the request the json properties are not defined then the string concatenated string will contain "undefined". I would have to check if that could cause conflicts that allow a transaction to seem valid.
* I explicitly chose to build models line by line for type safety.
* For LeaderboardGet, the UserId can exist in entries array.
* People who have the same score have different ranks.
* Offset in LeaderboardGet is 0 based
* Client is expected to deal with conflicts.

## If I had more time:
* Tests!!!
* Research an optimal way of getting the player rank.
* Setting up JSON schemas to verify the request body is valid JSON I expect.
* Figure out a way to keep the string literals DB fields or index names to be type checked with the models.
* Better error handling (including not looking up errors by name).
* Tracing through X-Ray
* Measuring latency
* Caching data.
* Set up migrations.
* Move secrets out to something else like encrypting code/config files or environment variables
* Add a message queue for operations that might have failed so the record can be processed at a later time instead of having the client deal with it.
* Keep track of the number of users in a LeaderboardId so I don't waste time scanning a table if an offset is larger than the number of users.
