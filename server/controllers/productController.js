const ObjectId = require('mongodb').ObjectId;
const { validateMIMEType } = require('validate-image-type');

const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const { pick } = require('lodash');

module.exports.newProduct = async(req, res)=>
{

    const datadidValid = await validDataInsert(req);
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
    const {id} = req.query;
    return validDataUpdate(id, req)
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
            console.log('==>', result)
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

function validDataInsert(req)
{
    const product = {
        date_created: new Date(),
        date_updated: new Date(),
    }
    const name = req.body.name;
    product.cate_id = req.body.cate_id;
    product.name = name ? name.toString() : null;

    if (req.file) {
        const validationResult = validateMIMEType(req.file?.path, {
          originalFilename: req.file?.originalname,
          allowMimeTypes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
        });
    
        if (!validationResult.ok) {
          return {
            code: 300,
            message: 'không đúng đinh dạng ảnh: image/jpeg, image/png , image/gif,image/jpg',
          };
        }
        product.image = req.file?.path;
    }
    return product
}

function validDataUpdate(id, req)
{
    return new Promise((resolve, reject) => 
    {
        if (!ObjectId.isValid(id)) {
            reject('Định danh không hợp lệ!');
        }
        if (Object.keys(req.body.name).length === 0) {
            reject('Vui lòng nhập nhập lại dữ liệu!');
        }
        const product = {
            date_updated: new Date()
        };
        if(req.body.name !==undefined){
            product.name =  req.body.name;
        }

        if (req.file) {
            const validationResult = validateMIMEType(req.file?.path, {
              originalFilename: req.file?.originalname,
              allowMimeTypes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
            });
            if (!validationResult.ok) {
              return {
                code: 300,
                message: 'không đúng đinh dạng ảnh: image/jpeg, image/png , image/gif,image/jpg',
              };
            }
            product.image = req.file?.path;
        }
     
        if(req.body.cate_id){
            product.cate_id = req.body.cate_id.toString()
        }
        resolve(product)
    })
}