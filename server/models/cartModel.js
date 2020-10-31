const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema({
    quantity: { type: Number },
    user_id : { type: Schema.Types.ObjectId, ref: "users" },
    product_id: {type: Schema.Types.ObjectId, ref: "products"},
    total_price: { type: Number }
})

module.exports = mongoose.model("carts", Cart);
