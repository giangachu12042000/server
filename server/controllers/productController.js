const ObjectId = require('mongodb').ObjectId;
const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const { pick } = require('lodash');

module.exports.newProduct = async(req, res)=>
{
    const data = req.body;
    if(data.name == '' || data.name.length < 2 || data.name.length > 40){
        return res.send({
            code:0,
            status:"faild",
            mesage:'không được để trống tên và tên nhỏ hơn 60 ký tự'
        }).status(200)
    }
    const datadidValid = await validDataInsert(data);
    const newProduct = new ProductModel({...datadidValid});
    let product = await newProduct.save();
    return res.send({
        code:1,
        status:"successful",
        data:product
    }).status(200)
}

module.exports.fetchAll = async(req, res) =>
{
    const params = req.query;
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const size = Number(params.size) > 0 ? Number(params.size) : 15;
    const searchProduct = {};

    if(params.search){
        searchProduct.$or = [{name: {$regex: `.*${params.search}*`, $options: 'ig'}}]
    }
    const rquestParmas = {
        page,
        size
    }
    const query = {
        ...searchProduct
    }
    ProductModel.getpagination(query, rquestParmas)
    .then(result => {
        return res.send({
            code: 1,
            status: "successfull",
            products: result.products,
            pagination: result.pagination,
        }).status(200)
    })
}


module.exports.findByCateId = async(req, res) =>
{
    const cateId = req.query.id;
    if(ObjectId.isValid(cateId)){
       const category = await CategoryModel.findById(cateId)
        return res.send({ code: 0, message: 'sucess', data: category });
    }
}

module.exports.updateProduct = async(req, res) =>
{
    const {data} = req.body;
    const {id} = req.params;
    return validDataUpdate(id, data)
    .then(productInsert=>{
        
       return ProductModel.updateOne({_id:ObjectId(id)}, {$set: productInsert});
    })
    .then(result=>{
        console.log(result,'===>')
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

module.exports.deleteProduct = async(req,res)=> {
    const id = req.query.id;
    if(ObjectId.isValid(id)){
        ProductModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
            if(err){
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
    const product = {
        date_created: new Date(),
        date_updated: new Date(),
    }
    const name = data.name;
    const desc =  data.description;
    const price = data.price;
    const quantity = data.quantity;
    const image = data.image;
    const cate_id = data.cate_id;

    product.name = name ? name.toString() : null;
    product.description = desc ? desc.toString() : null;
    product.price = Number(price) > 0 ? Number(price) : 1;
    product.quantity = Number(quantity) > 0 ? Number(quantity) : 1;
    product.image = image ? image.toString() : null
    product.cate_id = cate_id ? cate_id.toString() : 'null';

    return product
}

function validDataUpdate(id, data)
{
    return new Promise((resolve, reject) => 
    {
        console.log(!ObjectId.isValid(id),'=======>edit')
        if (!ObjectId.isValid(id)) {
            reject('Invalid identifier');
        }
        if (Object.keys(data).length === 0) {
            reject('Required fields are missing');
        }
        const product = {
            date_updated: new Date()
        };
        if(data.name !==undefined){
            product.name =  data.name;
        }
        if(Number(data.price) > 0){
            product.price = Number(data.price)
        }
        if(Number(data.quantity) > 0){
            product.quantity = Number(data.quantity)
        }
        if(data.cate_id){
            product.cate_id = data.cate_id.toString()
        }
        if(data.description !==undefined){
            product.description =  data.description;
        }
        resolve(product)
    })
}