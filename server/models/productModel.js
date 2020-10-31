const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name : {type: String, unique: true, required: true},
    price : {type: Number, require: true},
    quantity : {type: Number, require: true},
    image : {type:String, require:true},
    description : {type: String},
    date_created : {type: Date, default: Date.now},
    date_updated : {type: Date, default: Date.now},
    cate_id : {type: Schema.Types.ObjectId, ref: "categories"}
})

Product.statics.getpagination = function(query, requestParams){
    const {page, size} = requestParams
    return this.find(query)
    .skip(page * size - size)
    .limit(size)
    .then(products=> {
        return this.countDocuments()
         .then(count=> ({
                products: products,
                pagination: {
                    size,
                    page,
                    total: count
                }
             })
         )
     });
}

module.exports = mongoose.model('products', Product);