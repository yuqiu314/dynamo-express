const co = require('co');
const myAWS = require('./aws');
const Console = require('./console').Console;
const Cyan = require('./console').FgCyan;

const dynamodb = myAWS.dynamodb;
const streams = myAWS.streams;
const sqs = myAWS.sqs;
const QueueUrl = myAWS.QueueUrl;

function* getStreamArn(tname) {
  const result = yield dynamodb.describeTable.bind(dynamodb, {
    TableName: tname,
  });
  return result.Table.LatestStreamArn;
}

function* getLatestRecords(tname) {
  const streamArn = yield getStreamArn(tname);
  const params = {
    StreamArn: streamArn,
    Limit: 10,
  };

  const streamData = yield streams.describeStream.bind(streams, params);
  const shards = streamData.StreamDescription.Shards;

  const shardIterMap = {};
  for (let shardIdx = 0; shardIdx < shards.length; shardIdx += 1) {
    const shard = shards[shardIdx];
    const shardIterator = yield streams.getShardIterator.bind(streams, {
      ShardId: shard.ShardId,
      ShardIteratorType: 'LATEST',
      StreamArn: streamArn,
    });

    shardIterMap[shard.ShardId] = shardIterator.ShardIterator;

    ((shardId) => {
      setInterval(() => {
        streams.getRecords({
          ShardIterator: shardIterMap[shardId],
          Limit: 10,
        }, (err, data) => {
          const records = data.Records;
          const nextShardIter = data.NextShardIterator;
          if (nextShardIter) {
            shardIterMap[shardId] = nextShardIter;
          }
          if (records.length > 0) {
            records.forEach((r) => {
              sqs.sendMessage({
                QueueUrl,
                MessageBody: JSON.stringify(r, null, 2), //格式化打印
              }, (error, datas) => {
                if (error) Console.error('[DB Monitor]', error, err.stack);
                else Console.log(Cyan, '[DB Monitor]', 'MessageId', datas.MessageId, 'has been sent to SQS');
              });
            });
          }
        });
      }, 1000);
    })(shard.ShardId);
  }
}

let tableName = 'reply';
if (process.argv[2]) tableName = process.argv[2];
Console.log(Cyan, `[DB Monitor] monitor dynamodb table <${tableName}>...`);
co(function* foo() { yield* getLatestRecords(tableName); });
