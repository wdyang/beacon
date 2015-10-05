var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express_session = require('express-session');
var json_express = require('./routes/json/index');
   

var mongoose = require('mongoose');

var app = express();

app.set('port', process.env.PORT || 8090);

  
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(function(req, res, next) {
  var contentType = req.headers['content-type'] || ''
    , mime = contentType.split(';')[0];

  if (mime != 'text/plain' || mime != 'application/json' ) {
    return next();
  }

  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    req.rawBody =  data;
    next();
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'SeanLI',
    resave: false,
    saveUninitialized: false
}));
 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', json_express);

 //mongoose
mongoose.connect('mongodb://beacon:beacon@mongodb.code4demo.com/beacon');
// mongoose.connect('mongodb://localhost/beacon');

app.use('/', function(req, res, next){
  res.send("ivyarjmy");
  return;
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app;

// 启动及端口
http.createServer(app).listen(app.get('port'), "0.0.0.0", function() {
    console.log('Express server listening on port ' + app.get('port'));
});
