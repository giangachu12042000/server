const ObjectId = require('mongodb').ObjectId;
const GalleryModel = require('../models/galleryModel');
const { validateMIMEType } = require('validate-image-type');

module.exports.galleryCreate = async (req, res) => {
  const resultValidate = await validDataInsert(req);
  if (resultValidate?.code === 300) {
    return res
      .send({
        code: 300,
        message: resultValidate?.message,
      })
      .status(300);
  }
  const newSetting = new GalleryModel({ ...resultValidate });
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
  GalleryModel.getpagination(query, rquestParmas).then((result) => {
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

module.exports.findByGallery = async (req, res) => {
  const cateId = req.query.id;
  if (ObjectId.isValid(cateId)) {
    const resulte = await GalleryModel.findById(cateId);
    return res
      .send({ code: 200, message: 'sucess', data: resulte })
      .status(200);
  }
};

module.exports.updateGallery = async (req, res) => {
  const { id } = req.query;

  const dataValidate = await validDataUpdate(id, req);
  if (dataValidate?.code === 300) {
    return res.send({
        code: 300,
        message: dataValidate?.message,
      })
      .status(300);
  }
  GalleryModel.updateOne({_id:ObjectId(id)}, {$set: dataValidate})
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

module.exports.deleteGallery = async(req,res)=> {
  const id = req.query.id;
  if(ObjectId.isValid(id)){
    GalleryModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
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
  const gallery = {
    date_created: new Date(),
  };
  console.log(req,'==>???')
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

    gallery.image = req.file?.path;
  }
  gallery.url_social_media = req.body?.url_social_media;

  return gallery;
}

function validDataUpdate(id, req) {
  if (!ObjectId.isValid(id)) {
    return { code: 300, message: 'Định danh không hợp lệ!' };
  }
  if (Object.keys(req.body).length === 0) {
    return { code: 300, message: 'Vui lòng nhập nhập lại dữ liệu!' };
  }
  const gallery = {
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
    gallery.image = req.file?.path;
  }

  
  if (req.body?.url_social_media) {
    gallery.url_social_media = req.body?.url_social_media;
  }
  return gallery;
}
