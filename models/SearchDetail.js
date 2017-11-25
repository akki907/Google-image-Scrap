var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SearchSchema = new Schema({
  searchKeyword:String,
  createdDate: {type : Date , default : Date.now},
  path:{type : String , default : ''}
});
var model = mongoose.model('SearchDetail', SearchSchema);
module.exports = model;