const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });
AWS.config.update({
  accessKeyId: '123456',
  secretAccessKey: '123456',
  region: 'cn-north-1',
});
AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
  dynamodbstreams: '2012-08-10',
};

const options = {
  accessKeyId: 'yourid',
  secretAccessKey: 'yourkey',
  region: 'cn-north-1',
  endpoint: 'http://localhost:8000',
  apiVersion: '2012-08-10',
};

const sqs = new AWS.Endpoint('http://127.0.0.1:9494');
const sns = new AWS.Endpoint('http://127.0.0.1:9911');

module.exports.sqs = new AWS.SQS({ endpoint: sqs });
module.exports.sns = new AWS.SNS({ endpoint: sns });
module.exports.QueueUrl = 'http://127.0.0.1:9494/queueurl';
module.exports.dynamodb = new AWS.DynamoDB(options);
module.exports.docClient = new AWS.DynamoDB.DocumentClient(options);
module.exports.streams = new AWS.DynamoDBStreams(options);
module.exports.options = options;
module.exports.config = AWS.config;
