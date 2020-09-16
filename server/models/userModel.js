const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name:{type:String},
    password:{type:String},
    email:{type:String},
    date_created:{type:Date, default: Date.now},
    date_updated:{type:Date, default: Date.now}
})

module.exports = mongoose.model('users',User)