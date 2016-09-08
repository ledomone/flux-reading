var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var swig  = require('swig');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/books.png'));

app.get('/', function (req, res) {
  var page = swig.renderFile('views/index.html');
  res.status(200).send(page);
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
