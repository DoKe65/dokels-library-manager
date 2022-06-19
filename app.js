const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Import sequelize instance
const db = require("./models/index");
const { sequelize } = db;

// Test database connection and sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Routes
const indexRouter = require('./routes/index');
// const booksRouter = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if(err.status === 404) {
    res.locals.message = "Sorry! We couldn't find the page you were looking for.";
    res.render("page-not-found", { err, title: "Page Not Found"});
  } else if (!err.status || error.status === 500) {
    if (!err.status) {
      err.status = 500;
    }
    if (!err.message) {
      err.message = "Sorry! There was an unexpected error on the server.";
    }
    res.render("error", { err, title: "Server Error" });
    console.log(`Error Status: ${err.status}, ${err.message}, Stack: ${err.stack}`);
  } 
});


module.exports = app;
