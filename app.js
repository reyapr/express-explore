require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/user');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_CONNECTION)
const db = mongoose.connection;

db.on('error', () => {
  console.log(`Can't connect to the database`)
})

var app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

module.exports = app;
