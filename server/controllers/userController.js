const UserModel = require('../models/userModel');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const { _ } = require('lodash');

module.exports.newUser = async(req,res)=>
{
    const data = req.body;
    if(data.name == '' || data.name.length < 2 || data.name.length > 60){
        return res.send({
            code:0,
            status:"faild",
            mesage:'không được để trống tên và tên nhỏ hơn 60 ký tự'
        }).status(200)
    }
    const hashPass = await hasPassWord(data.password);
    const object = _.omit(data,'password');
    const newUser = new UserModel({...object, password:hashPass});
    let user = await newUser.save();
    const doc = _.omit(_.get(user, "_doc"), ["password"]);
    console.log(doc,'==>user')
    return res.send({
        code:1,
        status:"successful",
        data:doc
    }).status(200)
}

module.exports.fetchAll = async(req, res) =>
{
    const params = req.query;
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const size = Number(params.size) > 0 ? Number(params.size) : 1;
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
    UserModel.getPagination(query, requestParams)
    .then(result => {
        return res.send({
            code: 1,
            status: "successfull",
            users: result.users || [],
            pagination: result.pagination,
        }).status(200)
    })
}

module.exports.updateUser = async(req, res) =>
{
    const data = req.body;
    const id = req.params.id;
    console.log(id)
    return validDataUpdate(id, data)
    .then(userInsert=>{
       return UserModel.updateOne({_id:ObjectId(id)}, {$set: userInsert});
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

module.exports.deleteUser = async(req,res)=> {
    try{
        const id = req.params.id;
        if(ObjectId.isValid(id)){
            UserModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
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
    catch(err){
        console.log(err,'==>?er')
    }
}

const hasPassWord = async password =>
{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

const comparePassWord = async (password, hash) =>
{
    let result = await bcrypt.compare(password,hash);
    return result
}

module.exports.changePassWord = async(req, res)=>
{
    try{
        const pass = req.body.password;
        console.log(pass,'===>?')
    }
    catch(err){
        console.log(err,'=====>?>')
    }
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
        const user = {
            date_updated: new Date()
        };
        if(data.name !==undefined){
            user.name =  data.name;
        }
        if(data.email !==undefined){
            user.email =  data.email;
        }
        resolve(user)
    })
}