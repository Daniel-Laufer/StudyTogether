//TODO: Create a config helper class to handle all this config to lessen the clutter.
//TODO: modify the API entry point to /api/v1
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users');
const forgotRouter = require('./routes/forgot');
const studygroupsRouter = require('./routes/studygroups');
const viewsRouter = require('./views/views');
const reportsRouter = require('./routes/reports');

const app = express();

// swagger docs config
const swaggerUI = require('swagger-ui-express');
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
app.use('/admin', viewsRouter);
app.use('/reports', reportsRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
  res
    .status(404)
    .send(
      'Resource does not exist (T_T)7. Check out the documentation for help.'
    );
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
