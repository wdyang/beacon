var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BeaconDistance = new Schema({
        beacon:{macAddress:String,  //79:8D:EA:07:76:74,
                 proximityUUID:String, //8492e75f-4fd6-469d-b132-043fe94921d8, 
                 major:Number,//10241, 
                 minor:Number,//7084, 
                 measuredPower:Number,//-59, 
                 ssi:Number,//-63
                 },
     distance:Number,//1.6056822318059245,
     submittedAt:{type:Date,default:new Date()}
  });

 BeaconDistance.plugin(function(schema){
 
//get all  
   schema.statics.getAll = function(condition,cb){
     if (!condition) {
        condition = {page:0,items:10};
     }else if(condition.items < 0 ){
       condition.items = 10;
     }
 	     var self = this;
    	return  self.find()
      // .where('name.last').equals('Ghost')
      // .where('age').gt(17).lt(66)
      // .where('likes').in(['vaporizing', 'talking'])
      // .sort('-occupation')
      .limit(condition.items)
      .skip(condition.page)
      .select('beacon distance submittedAt')
      .exec(function(err,beaconDistances){
        return  cb(err,beaconDistances);
    });
    }

//add  
    schema.statics.add  = function (beaconDistance, cb,options) {
        var self = this;
   return    beaconDistance.save(function(err,result) {
                  return   cb(err,result);
    });
    }

});

 
module.exports = mongoose.model('BeaconDistances', BeaconDistance);