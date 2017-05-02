const spawn = require('child_process').spawn;
const myAWS = require('./aws');

const dynamodb = myAWS.dynamodb;
// start sqs monitor as child_process
spawn(process.execPath, ['mon-sqs.js']).stdout.pipe(process.stdout);
// start db monitor as child_process
dynamodb.listTables({},
  (err, data) => {
    if (data) {
      data.TableNames.forEach((name) => {
        dynamodb.describeTable({
          TableName: name,
        }, (error, datas) => {
          if (datas
            && datas.Table.StreamSpecification
            && datas.Table.StreamSpecification.StreamEnabled) {
            spawn(process.execPath, ['mon-db.js', name]).stdout.pipe(process.stdout);
          }
        });
      });
    }
  });

// start web server
const express = require('express');
const swig = require('swig-templates');
const Console = require('./console').Console;
const Black = require('./console').FgBlack;

const app = express();
const swigFilters = require('./lib/filters');

const swigEngine = new swig.Swig();
app.engine('html', swigEngine.renderFile);
Object.keys(swigFilters).forEach((name) => {
  swig.setFilter(name, swigFilters[name]);
});
app.set('views', './lib/views');
app.set('view engine', 'html');
app.set('view options', { layout: false });

app.use(express.static(__dirname));
app.use(require('body-parser').json());
app.use('/', require('./lib/routes/api'));

app.listen(process.env.port || 4000, () => {
  Console.log(Black, '[Web Server]', 'listerning for request...');
});
