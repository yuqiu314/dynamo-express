const _ = require('lodash');
const express = require('express');
const myAWS = require('../../aws');
const spawn = require('child_process').spawn;

const router = express.Router();
const dynamodb = myAWS.dynamodb;
const docClient = myAWS.docClient;
const options = myAWS.options;
const config = myAWS.config;

// --------all helper go here------------
function addTrailingSlash(s) {
  return s + (s[s.length - 1] === '/' ? '' : '/');
}

function buildBaseHref(originalUrl, reqUrl) {
  if (reqUrl === '/') {
    return addTrailingSlash(originalUrl);
  }
  const idx = originalUrl.lastIndexOf(reqUrl);
  const rootPath = originalUrl.substring(0, idx);
  return addTrailingSlash(rootPath);
}

// --------all table api go here------------
router.get('/api/tables', (req, res) => {
  dynamodb.listTables({},
    (err, data) => { res.send(err || data); });
});

router.post('/api/table', (req, res) => {
  dynamodb.createTable(req.body,
    (err, data) => { res.send(err || data); });
});

router.delete('/api/table/:name', (req, res) => {
  dynamodb.deleteTable({
    TableName: req.params.name || 'table_name',
  }, (err, data) => { res.send(err || data); });
});

router.get('/api/table/:name', (req, res) => {
  dynamodb.describeTable({
    TableName: req.params.name || 'tablen_name',
  }, (err, data) => { res.send(err || data); });
});

router.put('/api/table', (req, res) => {
  dynamodb.updateTable(req.body,
    (err, data) => {
      res.send(err || data);
      spawn(process.execPath, ['mon-db.js', req.body.TableName]).stdout.pipe(process.stdout);
    });
});

// --------all item api go here------------
router.post('/api/item', (req, res) => {
  docClient.put(req.body,
    (err, data) => { res.send(err || data); });
});

router.post('/api/items', (req, res) => {
  docClient.batchWrite(req.body,
    (err, data) => { res.send(err || data); });
});

router.get('/api/item/:cond', (req, res) => {
  docClient.get(JSON.parse(req.params.cond),
    (err, data) => { res.send(err || data); });
});

router.get('/api/items/:cond', (req, res) => {
  docClient.batchGet(JSON.parse(req.params.cond),
    (err, data) => { res.send(err || data); });
});

router.delete('/api/item/:cond', (req, res) => {
  docClient.delete(JSON.parse(req.params.cond),
    (err, data) => { res.send(err || data); });
});

router.delete('/api/items/:cond', (req, res) => {
  docClient.batchWrite(JSON.parse(req.params.cond),
    (err, data) => { res.send(err || data); });
});

// --------all pages go here------------
router.get('/',
  (req, res) => { res.redirect('/tables'); });

router.get('/tables', (req, res) => {
  dynamodb.listTables({}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.render('tables',
      _.merge(data, options, config.apiVersions, {
        baseHref: buildBaseHref(req.originalUrl, req.url),
      }));
    }
  });
});

router.get('/table/:name', (req, res) => {
  const promises = [];
  promises.push(new Promise((resolve, reject) => dynamodb.listTables({
  }, (err, data) => { if (err) return reject(err); return resolve(data); })));
  promises.push(new Promise((resolve, reject) => dynamodb.describeTable({
    TableName: req.params.name || 'forum',
  }, (err, data) => { if (err) return reject(err); return resolve(data); })));
  Promise.all(promises).then((results) => {
    res.render('table',
    _.merge(results[0], results[1], options, config.apiVersions, {
      baseHref: buildBaseHref(req.originalUrl, req.url),
      columns: ['Name', 'Type', 'Primary Key', 'GSI', 'LSI'],
    }));
  }, (err) => {
    res.send(err);
  });
});

module.exports = router;
