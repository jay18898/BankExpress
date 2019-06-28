var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var banksRouter = require('./routes/banks'); 

  
const PORT = process.env.PORT || 3000

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', banksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 3000);
    res.send('error');
  });
  



app.listen(PORT,()=>console.log('Listning on Port 3000'))


  module.exports = app;
  
