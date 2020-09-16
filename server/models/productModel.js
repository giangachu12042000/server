const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name : {type: String, unique: true, required: true},
    price : {type: Number, require: true},
    quantity : {type: Number, require: true},
    image : {type:String, require:true},
    description : {type: String},
    date_created : {type: Date, default: Date.now},
    date_updated : {type: Date, default: Date.now},
    cate_id : {type: Schema.Types.ObjectId, ref: "categories"}
})

module.exports = mongoose.model('products', Category);