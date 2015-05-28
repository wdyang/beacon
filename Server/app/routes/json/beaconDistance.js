var express = require('express');
var BeaconDistance = require('../../models/beaconDistance');

var router = express.Router();

function getAll(req, res) {
  
  var condtions = null;
  if (req.parameters.page && req.parameters.items) {
     condtions ={page:req.parameters.page,items:req.parameters.items};
  };
 return   BeaconDistance.getAll(condtions,function(err,beaconDistances){
        return res.send({status: 0, 
                        message: "get All info success",
                        content:beaconDistances});
    });
}

//getAll
router.all("/getAll",getAll );
router.all("/",getAll );

//clear
router.all("/clear",function(req, res){
  return  BeaconDistance.clear(function (err) {
        if (err) {
          return res.send({status: 1, message: "clear fail"});
        } else {
          return res.send({status: 0, message: "clear Success."});
         }
    });
});

 
//add  
router.all('/add', function (req, res) {

  var beaconDistance  = new BeaconDistance({beacon:req.parameters.beacon,distance:req.parameters.distance}); 
  return  BeaconDistance.add(beaconDistance,function (err, response) {
        if (err) {
          return res.send({status: 1, message: response});
        } else {
          return res.send({status: 0, message: "Add Success.", content:response});
         }
    });
});

exports = module.exports = router;