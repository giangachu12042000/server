const ObjectId = require('mongodb').ObjectId;
const { validateMIMEType } = require('validate-image-type');

const AboutUsModel = require('../models/aboutUsModel');

module.exports.createAbout = async (req, res) => {
  const resultValidate = await validDataInsert(req);
  console.log(resultValidate,'---->?date')
  if (resultValidate?.code === 300) {
    return res
      .send({
        code: 300,
        message: resultValidate?.message,
      })
      .status(300);
  }

  const newAbout = new AboutUsModel({ ...resultValidate });
  let result = await newAbout.save();
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

  const rquestParmas = {
    page,
    size,
  };
  const query = {
    ...searchProduct,
  };
  AboutUsModel.getpagination(query, rquestParmas).then((result) => {
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

module.exports.findAboutByid = async (req, res) => {
  const cateId = req.query.id;
  console.log(cateId,'--->???')
  if (ObjectId.isValid(cateId)) {
    const resulte = await AboutUsModel.findById(cateId);
    return res
      .send({ code: 200, message: 'sucess', data: resulte })
      .status(200);
  }else{
    res.send({ code: 300, message: 'failed', })
    .status(300);
  }
};

module.exports.updateAboutUs = async (req, res) => {
  const { id } = req.body;

  const dataValidate = await validDataUpdate(id, req);
  if (dataValidate?.code === 300) {
    return res.send({
        code: 300,
        message: dataValidate?.message,
      })
      .status(300);
  }
  AboutUsModel.updateOne({_id:ObjectId(id)}, {$set: dataValidate})
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

module.exports.deleteAbout = async(req,res)=> {
  const id = req.query.id;
  if(ObjectId.isValid(id)){
    AboutUsModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
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
  } else {
    return res.send({
        code:300,
        message:"failed",
        data:result
    }).status(300)
  }
}

function validDataInsert(req) {
  const abouUs = {
    date_created: new Date(),
  };

  abouUs.introduce = req.body?.introduce;

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
    abouUs.image = req.file?.path;
  }
  return abouUs;
}

function validDataUpdate(id, req) {
  if (!ObjectId.isValid(id)) {
    return { code: 300, message: 'Định danh không hợp lệ!' };
  }
  if (Object.keys(req.body).length === 0) {
    return { code: 300, message: 'Vui lòng nhập nhập lại dữ liệu!' };
  }
  const aboutUpdate = {
    date_updated: new Date(),
  };
  if(req.body?.introduce){
      aboutUpdate.introduce = req.body?.introduce;
  }
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
    aboutUpdate.image = req.file?.path;
  }
  return aboutUpdate;
}
