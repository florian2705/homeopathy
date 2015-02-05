var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/homeopathy');
var ObjectID = mongo.ObjectID;

// MONGOOSE is used to aggregate names with the number of fotos
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/homeopathy");

fotoSchema = new Schema({
  "name": String,
  "url": String
});
memberSchema = new Schema({
  friends: [fotoSchema]
});
var fotoModel = mongoose.model("fotos", fotoSchema );


var moment = require('moment');

function writeQuestionsToDB (name, questions, ip) {
  var collection = db.get('questions');
  collection.insert(  { "name" : name, "questions" : questions, "ip" : ip, "date": moment().format() }, function (err, doc) {
    if (err) {
      // If it failed, return error
      console.log("There was a problem adding the information to the database.");
    }
    else {
      // If it worked
    }
  }
  );
};

function pastQuestionList (callback) {
   var collection = db.get ('questions');
   collection.find ({},{}, callback);
}

function pastQuestion (id, callback) {
   var collection = db.get ('questions');
   var OId = require('mongodb').ObjectID;
   //console.log("Oid: " + OId);
   //console.log("Oid as ObjectId" + OId(id));
   collection.findOne ({"_id": OId(id)},{}, callback);
}


// EXPORTS
module.exports.writeQuestionsToDB = writeQuestionsToDB;
module.exports.pastQuestionList  = pastQuestionList;
module.exports.pastQuestion = pastQuestion ;
