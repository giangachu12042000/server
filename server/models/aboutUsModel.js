const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutUs = new Schema({
    image: {type: String},
    introduce: {type: String},
    date_created:{type: Date,default: Date.now},
    date_updated:{type: Date,default: Date.now},
})

AboutUs.statics.getpagination = function(query, requestParams){
    const {page, size} = requestParams
    return this.find(query)
    .skip(page * size - size)
    .limit(size)
    .then(result=> {
        return this.countDocuments()
         .then(count=> ({
                data: result,
                pagination: {
                    page,
                    total: count
                }
             })
         )
     });
}

module.exports = mongoose.model("about_us", AboutUs);