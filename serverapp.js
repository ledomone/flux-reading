var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var React = require('react');
var ReactDOM = require('react-dom/server');
// var Router = require('react-router').Router;
import { Router } from 'react-router';

var swig  = require('swig');

var routes = require('./app/routes');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/books.png'));

// middleware
app.use(function (req, res) {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
    Router.match({
      routes: routes.default,
      location: req.url
    }, function (err, redirectLocation, renderProps) {
      if (err) {
        res.status(500).send(err.message);
      } else if (redirectLocation) {
        res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        // You can also check renderProps.components or renderProps.routes for
        // your "not found" component or route respectively, and send a 404 as
        // below, if you're using a catch-all route.
        var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
        var page = swig.renderFile('views/index.html', {
          html: html
        });
        res.status(200).send(page);
      } else {
        res.status(404).send('Page Not Found');
      }
    });
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
