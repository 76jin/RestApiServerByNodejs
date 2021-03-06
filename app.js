var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var morgan = require('morgan');

var MongoClient = require('mongodb').MongoClient;
var database; // 데이터베이스 객체

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sampleRouter = require('./routes/sample');
var processRouter = require('./routes/process');

var app = express();

var winston = require('./winston');
var logger = winston;

app.use(morgan('combined', {
  stream: winston.stream
}));

// 데이터베이스 연결 
function connectDB() {
  var databaseUrl = 'mongodb://localhost:27017/local';

  MongoClient.connect(databaseUrl, function (err, db) {
    if (err) throw err;
    logger.info("### 데이터베이스에 연결됐습니다 :" + databaseUrl);
    database = db.db('local');

    usersRouter.init(database);
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sample', sampleRouter);
app.use('/process', processRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

connectDB();

module.exports = app;