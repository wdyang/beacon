var express = require('express');
var BeaconDistance = require('../../models/beaconDistance');

var router = express.Router();

function getAll(req, res) {
  
 return   BeaconDistance.getAll({page:0,items:10},function(err,beaconDistances){
        return res.send({status: 0, 
                        message: "get All info success",
                        content:beaconDistances});
    });
}

//getAll
router.all("/getAll",getAll );
router.all("/",getAll );
 
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