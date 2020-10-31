const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require("lodash");

const User = new Schema({
    name: {type:String},
    password: {type:String},
    email: {type:String},
    date_created: {type:Date, default: Date.now},
    date_updated: {type:Date, default: Date.now}
})

User.statics.getPagination = function(query, requestParam){

    const page = requestParam.page;
    const size = requestParam.size;
    return this.find(query)
    .skip(page * size - size)
    .limit(size)
    .then(users=> {
        users = _.map(users, item =>
            _.pick(item, [
              "_id",
              "name",
              "email",
              "created_date",
              "updated_date",
            ])
        );

       return this.countDocuments()
        .then(count=> ({
                users: users,
                pagination: {
                    size,
                    page,
                    total: count
                }
            })
        )
    });
}

module.exports = mongoose.model('users', User);