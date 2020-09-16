const ObjectId = require('mongodb').ObjectId;
const CartModel = require('../models/cartModel');

module.exports.newCart = async(req, res)=>
{
    const data = req.body;
    const datadidValid = await validDataInsert(data);
    const newCart = new CartModel({...datadidValid});
    let cart = await newCart.save();
    return res.send({
        code:1,
        status:"successful",
        data:cart
    }).status(200)
}

module.exports.fetchAll = async(req, res) =>
{
    const params = req.query;
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const size = Number(params.size) > 0 ? Number(params.size) : 1;
    const carts = await CartModel.find()
    .skip(page*size - size)
    .limit(size);
    return res.send({
        code:1,
        status:"successfull",
        data:carts
    }).status(200)
}

module.exports.updateCart = async(req, res) =>
{
    const data = req.body;
    const id = req.query.id;
    console.log(id,'==>')
    return validDataUpdate(id, data)
    .then(cartInsert=>{
        console.log(cartInsert,'==>?')
       return CartModel.updateOne({_id:ObjectId(id)}, {$set: cartInsert});
    })
    .then(result=>{
        console.log(result)
        return res.send({
            code:1,
            status:"successfull",
            data:result
        }).status(200)
    })
    .catch(err=>{
        return res.send({
            code:0,
            status:"err",
            data:err
        }).status(500)
    })
}

module.exports.deleteCart= async(req,res)=> {
    const id = req.query.id;
    console.log(ObjectId(id),'===>')
    if(ObjectId.isValid(id)){
        CartModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
            console.log(result,'==>result')
            if(err){
                console.log(err,'==>er')
                return res.send({
                    code:0,
                    status:"error",
                    data:err
                }).status(500)
            }
            return res.send({
                code:1,
                status:"successfull",
                data:result
            }).status(200)
        })
    }
}

function validDataInsert(data)
{
    const cart = {
        date_created: new Date(),
        date_updated: new Date(),
    }
    const quantity = data.quantity;
    const total_price =  data.total_price;
    const user_id = data.user_id;
    const product_id = data.product_id;

    cart.quantity = Number(quantity) ? Number(quantity) : null;
    cart.total_price = Number(total_price) ? Number(total_price) : null;
    cart.user_id = user_id ? user_id.toString() : null;
    cart.product_id = product_id ? product_id.toString() : null;
    return cart
}

function validDataUpdate(id, data)
{
    return new Promise((resolve, reject) => 
    {
        if (!ObjectId.isValid(id)) {
            reject('Invalid identifier');
        }
        if (Object.keys(data).length === 0) {
            reject('Required fields are missing');
        }

        const cart = {
            date_updated: new Date()
        };
        if(data.quantity !==undefined){
            cart.quantity =  Number(data.quantity);
        }
        if(data.user_id !==undefined){
            cart.user_id =  data.user_id.toString();
        }
        if(data.product_id !==undefined){
            cart.product_id =   data.product_id.toString();
        }
        if(data.total_price !==undefined){
            cart.total_price =  Number(data.total_price);
        }
        resolve(cart)
    })
}