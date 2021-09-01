const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebSetting = new Schema({
    logo: {type: String},
    email: {type: String},
    url_facebook: {type: String},
    url_instagram: {type: String},
    url_youtube: {type: String},
    logo_footer: {type: String},
    address: {type: String},
    copyright: {type: String},
    phone_number: {type: String},
    date_created:{type: Date,default: Date.now},
    date_updated:{type: Date,default: Date.now},
});

WebSetting.statics.getpagination = function(query, requestParams){
    return this.find(query)
        .then(res => ({
            data: res,
            })
        )
}
module.exports = mongoose.model("web_setting", WebSetting);