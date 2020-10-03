var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name:{type: String, unique: true },
    date_created:{type: Date,default: Date.now},
    date_updated:{type: Date,default: Date.now}
})

Category.statics.getPagination = function(query, requestParam){

    const page = requestParam.page;
    const size = requestParam.size;

    return this.find(query)
    .skip(page * size - size)
    .limit(size)
    .then(categories=> {
       return this.countDocuments()
        .then(count=> ({
                categories: categories,
                pagination: {
                    size,
                    page,
                    total: count
                }
            })
        )
    });
}

module.exports = mongoose.model('categories', Category);