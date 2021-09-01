const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contact = new Schema({
    username: {type: String},
    phone_number: {type: String},
    desc: {type: String},
    email: {type: String},
    address: {type: String},
    is_contact: {type: Number},
    date_created:{type: Date,default: Date.now},
    date_updated:{type: Date,default: Date.now},
})

Contact.statics.getpagination = function(query, requestParams){
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

module.exports = mongoose.model("contact", Contact);