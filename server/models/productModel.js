const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: {type: String},
    image: {type: String},
    introduce: {type: String},
    cate_id: {type: Schema.Types.ObjectId, ref: "category"},
    date_created:{type: Date,default: Date.now},
    date_updated:{type: Date,default: Date.now},
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