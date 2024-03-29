const ObjectId = require('mongodb').ObjectId;
const CategoryModel = require('../models/categoryModel');

module.exports.newCategory = async(req, res)=>
{
    const data = req.body;
    if(data.name == '' || data.name.length < 1 || data.name.length > 40) {
        return res.send({
            code:0,
            status:"faild",
            mesage:'không được để trống tên và tên nhỏ hơn 60 ký tự'
        }).status(200)
    }
    const datadidValid = await validDataInsert(data);
    const newCategory = new CategoryModel({...datadidValid});
    let category = await newCategory.save();
    return res.send({
        code:1,
        status:"successful",
        category:category
    }).status(200)
}

module.exports.fetchAll = (req, res) =>
{
    const params = req.query;
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const size = Number(params.size) > 0 ? Number(params.size) : 10;
    const searchCate = {};
    
    if(params.search) {
        searchCate.$or = [{name:{$regex: `.*${params.search}*`, $options:'ig'}}]
    }
    const query = {
        ...searchCate
    }
    const requestParams = {
        page,
        size
    }


    CategoryModel.getPagination(query, requestParams)
    .then(result => {
        return res.send({
            code: 1,
            status: "successfull",
            categories: result.categories,
            pagination: result.pagination,
        }).status(200)
    })
}

module.exports.updateCategory = async(req, res) =>
{
    const data = req.body;
    const {id} = req.query;

    return validDataUpdate(id, data)
    .then(categoryInsert=>{
       return CategoryModel.updateOne({_id: ObjectId(id)}, {$set: categoryInsert});
    })
    .then(result=>{
        console.log(result)
        return res.send({
            code: 1,
            status: "successfull",
            catgory: result
        }).status(200)
    })
    .catch(err=>{
        return res.send({
            code: 0,
            status: "err",
            data: err
        }).status(500)
    })
}

module.exports.deleteCategory = async(req,res)=> {
    const id = req.query.id;
    if(ObjectId.isValid(id)){
        CategoryModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
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
                category:result
            }).status(200)
        })
    }
}

function validDataInsert(data)
{
    const category = {
        date_created: new Date(),
        date_updated: new Date(),
    }
    const name = data.name;
    const desc =  data.description;
    category.name = name ? name.toString() : null;
    return category
}

function validDataUpdate(id, data)
{
    return new Promise((resolve, reject) => {
        if (!ObjectId.isValid(id)) {
            reject('Invalid identifier');
        }
        if (Object.keys(data).length === 0) {
            reject('Required fields are missing');
        }

        const category = {
            date_updated: new Date()
        };
        if(data.name){
            category.name =  data.name;
        }
        return resolve(category)
    })
}
