var express = require('express');
var beaconDistance_routes = require('./beaconDistance');


var json_app = express();

var mergeReqParams = function (req, res, next) {
 
  req.parameters = {};

//suport boody.json form key
if (req.body.json) {
  var jsonObject = JSON.parse(req.body.json);
   for (var key in jsonObject) {
    req.parameters[key] = jsonObject[key];
   }
 delete req.body.json;
}

//suport req.query.json form key
if (req.query.json) {
  var jsonObject = JSON.parse(req.query.json);
   for (var key in jsonObject) {
    req.parameters[key] = jsonObject[key];
   }
 delete req.query.json;
}

  if (req.headers["content-type"] == "application/json") {
    req.body = JSON.parse(req.body);
  }

if (req.rawBody) {
  req.rawBody = JSON.parse(req.rawBody);
   for (var key in req.rawBody) {
    req.parameters[key] = req.rawBody[key];
  }
}

  //Merge  req.body & req.query  
  for (var bodyKey in req.body) {
    req.parameters[bodyKey] = req.body[bodyKey];
  }

  for (var queryKey in req.query) {
    req.parameters[queryKey] = req.query[queryKey];
  }

  for (var key in req.params) {
    req.parameters[key] = req.params[key];
  }

  next();

};
 

//beaconDistance
json_app.use("/beaconDistance", mergeReqParams, beaconDistance_routes);

module.exports = json_app;