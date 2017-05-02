const myAWS = require('./aws');
const Console = require('./console').Console;
const Blue = require('./console').FgBlue;

const sqs = myAWS.sqs;
const QueueUrl = myAWS.QueueUrl;

Console.log(Blue, '[SQS Monitor]', 'monitor sqs...');
setInterval(() => {
  sqs.receiveMessage({
    MaxNumberOfMessages: 10,
    QueueUrl,
  }, (err, data) => {
    if (data.Messages && data.Messages.length > 0) {
      const deleteParams = {
        Entries: [],
        QueueUrl,
      };
      data.Messages.forEach((m) => {
        Console.log(Blue, '[SQS Monitor]', 'Message Body', m.Body, 'has been received.');
        deleteParams.Entries.push({
          Id: m.MessageId,
          ReceiptHandle: m.ReceiptHandle,
        });
      });
      sqs.deleteMessageBatch(deleteParams, (error, datas) => {
        if (error) Console.error('[SQS Monitor]', error, err.stack);
        else {
          datas.Successful.forEach((m) => {
            Console.log(Blue, '[SQS Monitor]', 'MessageId', m, 'has been deleted.');
          });
        }
      });
    }
  });
}, 1000);
