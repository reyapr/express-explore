require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const exceptionHandler = require('./src/controller/exceptionHandler/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const sequelize = require('./src/config/postgresql');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/user');
const organizationRouter = require('./src/routes/organization');
const { ORGANIZATIONS } = require('./src/routes/constant/organizationPath');
const { USERS } = require('./src/routes/constant/userPath');

const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true })
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
app.use(USERS, usersRouter);
app.use(ORGANIZATIONS, organizationRouter);
app.use(exceptionHandler)
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

module.exports = app;
