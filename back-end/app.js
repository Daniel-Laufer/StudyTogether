//TODO: Create a config helper class to handle all this config to lessen the clutter.

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config();

var usersRouter = require('./routes/users');
var forgotRouter = require('./routes/forgot');
var studygroupsRouter = require('./routes/studygroups');

var app = express();

// swagger docs config
var swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// MiddleWare
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/forgot', forgotRouter);
app.use('/users', usersRouter);
app.use('/studygroups', studygroupsRouter);

// Connect to MongoDB Atlas cluster
const uri =
  process.env.NODE_ENV === 'test'
    ? process.env.ATLAS_URI_TEST //testing
    : process.env.ATLAS_URI; //development & production

mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
