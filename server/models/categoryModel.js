const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name:{type:String, unique:true, required:true},
    description:{type:String},
    date_created:{type:Date,default:Date.now},
    date_updated:{type:Date,default:Date.now}
})

module.exports = mongoose.model('categories', Category);