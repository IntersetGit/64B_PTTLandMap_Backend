const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const upload = require("express-fileupload");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");
const paginate = require('express-paginate');
const { swagger, options } = require("./swagger/index");
require('./socket')
require('./cron')

app.use(cors());
// app.use(helmet());
app.use(paginate.middleware(10, 50));
app.use(upload())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("./routes"));

swagger.serveSwagger(app, "/api", options, {
  routePath: "./routes/",
  requestModelPath: "./swagger/",
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
app.use(errorHandler);

module.exports = app;
