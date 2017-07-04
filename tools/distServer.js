import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';
const logger = require('tracer').colorConsole();


const port = 9006;
const app = express();

app.use(compression());
app.use(express.static('dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../dist/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    logger.error(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
