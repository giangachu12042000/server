const ObjectId = require('mongodb').ObjectId;
const WebSettingModel = require('../models/webSettingModel');
const { validateMIMEType } = require('validate-image-type');
let validator = require('email-validator');

module.exports.createWebSeting = async (req, res) => {
  const resultValidate = await validDataInsert(req);
  if (resultValidate?.code === 300) {
    return res
      .send({
        code: 300,
        message: resultValidate?.message,
      })
      .status(300);
  }
  const newSetting = new WebSettingModel({ ...resultValidate });
  let result = await newSetting.save();
  return res
    .send({
      code: 200,
      message: 'successful',
      data: result,
    })
    .status(200);
};

module.exports.fetchAll = async (req, res) => {
  const params = req.query;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const size = Number(params.size) > 0 ? Number(params.size) : 15;
  const searchProduct = {};

  if (params.search) {
    searchProduct.$or = [
      { name: { $regex: `.*${params.search}*`, $options: 'ig' } },
    ];
  }
  const rquestParmas = {
    page,
    size,
  };
  const query = {
    ...searchProduct,
  };
  WebSettingModel.getpagination(query, rquestParmas).then((result) => {
    return res
      .send({
        code: 200,
        status: 'successfull',
        data: result.data,
        pagination: result.pagination,
      })
      .status(200);
  });
};

module.exports.findByWebSettingId = async (req, res) => {
  const cateId = req.query.id;
  if (ObjectId.isValid(cateId)) {
    const resulte = await WebSettingModel.findById(cateId);
    return res
      .send({ code: 200, message: 'sucess', data: resulte })
      .status(200);
  }
};

module.exports.updateWebSetting = async (req, res) => {
  const { id } = req.body;

  const dataValidate = await validDataUpdate(id, req);
  if (dataValidate?.code === 300) {
    return res.send({
        code: 300,
        message: dataValidate?.message,
      })
      .status(300);
  }
 WebSettingModel.updateOne({_id:ObjectId(id)}, {$set: dataValidate})
  .then(result=>{
      return res.send({
          code:200,
          status:"successfull",
          data:result
      }).status(200)
  })
  .catch(err=>{
      return res.send({
          code:500,
          status:"sửa không thành công!",
          data:err
      }).status(500)
  })
};

module.exports.deleteWebSetting = async(req,res)=> {
  const id = req.query.id;
  if(ObjectId.isValid(id)){
    WebSettingModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
          if(err){
              return res.send({
                  code:300,
                  message:"error",
                  data:err
              }).status(300)
          }
          return res.send({
              code:200,
              message:"successfull",
              data:result
          }).status(200)
      })
  }
}

function validDataInsert(req) {
  const webSetting = {
    date_created: new Date(),
  };
  if (req.file) {
    const validationResult = validateMIMEType(req.file?.path, {
      originalFilename: req.file?.originalname,
      allowMimeTypes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
    });

    if (!validationResult.ok) {
      return {
        code: 300,
        message: 'image/jpeg, image/png , image/gif,image/jpg',
      };
    }
    webSetting.logo = req.file?.path;
  }
  // else{
  //     return {code: 300, message:"image/jpeg, image/png , image/gif,image/jpg" };
  // }
  if(req.body.email){
    const validateEmail = validator.validate(req.body?.email);
    if (validateEmail) {
      webSetting.email = req.body.email;
    }
    else{
      return {code: 300, message: 'Không đúng định dạng email, vui lòng kiểm tra lại'}
    }
  }
  webSetting.url_facebook = req.body?.url_facebook;
  webSetting.url_instagram = req.body?.url_instagram;
  webSetting.url_youtube = req.body?.url_youtube;
  webSetting.address = req.body?.address;
  webSetting.copyright = req.body?.copyright;

  let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  if (vnf_regex.test(req.body?.phone_number)) {
    webSetting.phone_number = req.body?.phone_number;
  } else {
    return {
      code: 300,
      message: 'Không đúng định dạng số điện thoại, vui lòng kiểm tra lại',
    };
  }

  return webSetting;
}

function validDataUpdate(id, req) {
  if (!ObjectId.isValid(id)) {
    return { code: 300, message: 'Định danh không hợp lệ!' };
  }
  if (Object.keys(req.body).length === 0) {
    return { code: 300, message: 'Vui lòng nhập nhập lại dữ liệu!' };
  }
  const webSettingUpdate = {
    date_updated: new Date(),
  };
  if (req.file) {
    const validationResult = validateMIMEType(req.file?.path, {
      originalFilename: req.file?.originalname,
      allowMimeTypes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
    });

    if (!validationResult.ok) {
      return {
        code: 300,
        message: 'image/jpeg, image/png , image/gif,image/jpg',
      };
    }
    webSettingUpdate.logo = req.file?.path;
  }

  if (req.body?.email) {
    const validateEmail = validator.validate(req.body?.email);
    if (validateEmail) {
      webSettingUpdate.email = req.body.email;
    } else {
      return {
        code: 300,
        message: 'Không đúng định dạng email, vui lòng kiểm tra lại',
      };
    }
  }
  if (req.body?.url_facebook) {
    webSettingUpdate.url_facebook = req.body?.url_facebook;
  }
  if (req.body?.url_instagram) {
    webSettingUpdate.url_instagram = req.body?.url_instagram;
  }
  if (req.body?.url_youtube) {
    webSettingUpdate.url_youtube = req.body?.url_youtube;
  }
  if (req.body?.address) {
    webSettingUpdate.address = req.body?.address;
  }
  if (req.body?.copyright) {
    webSettingUpdate.copyright = req.body?.copyright;
  }
  console.log(webSettingUpdate, '222---->??dadad');
  let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  if (req.body?.phone_number) {
    if (vnf_regex.test(req.body?.phone_number)) {
      webSettingUpdate.phone_number = req.body?.phone_number;
    } else {
      return {
        code: 300,
        message: 'Không đúng định dạng số điện thoại, vui lòng kiểm tra lại',
      };
    }
  }
  return webSettingUpdate;
}
