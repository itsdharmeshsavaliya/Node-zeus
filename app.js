var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/userRouter');
var analyticsDataRoute = require("./routes/analyticsDataRoute");
var packageRoute = require("./routes/packageRoute");
var adminRoute = require("./routes/admin");

var app = express(); 

//DataBase Configration 
require("./db/dbConfig");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public/images/uploads', express.static(__dirname + '/public/images/uploads'));
app.use(cors());
app.use(logger('dev'));
//app.use(express.json());
app.use(bodyParser.json({ limit: '800mb' }));
app.use(express.urlencoded({ limit: '800mb', extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/analyticsData', analyticsDataRoute);
app.use('/package', packageRoute);
app.use('/admin', adminRoute);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, function (err) {
  console.log("Server listening on Port", process.env.PORT);
})

module.exports = app;
