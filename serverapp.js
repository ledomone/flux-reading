var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

import React from 'react';
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './app/routes';

var swig  = require('swig');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/books.png'));

// middleware
app.use((req, res) => {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
    match({ routes: routes, location: req.url }, (err, redirectLocation, renderProps) => {

      if (err) {
        res.status(500).send(err.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        // You can also check renderProps.components or renderProps.routes for
        // your "not found" component or route respectively, and send a 404 as
        // below, if you're using a catch-all route.

        let html = renderToString(<RouterContext {...renderProps} />);
        let page = swig.renderFile('views/index.html', { html: html });
        res.status(200).send(page);
      } else {
        res.status(404).send('Page Not Found :(');
      }
    });
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
