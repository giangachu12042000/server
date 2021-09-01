const ObjectId = require('mongodb').ObjectId;
const ContactModel = require('../models/contactModel');
const { validateMIMEType } = require('validate-image-type');
let validator = require('email-validator');

module.exports.createContact = async (req, res) => {
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

  const newContact = new ContactModel({ ...resultValidate });
  let result = await newContact.save();
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

  if (params.email) {
    searchProduct.$or = [
      { email: { $regex: `.*${params.email}*`, $options: 'ig' } },
    //  { email : params.email}
    ];
  }
  if (params.is_contact) {
    searchProduct.$or = [
      {
        is_contact : params.is_contact
      }
    ];
  }
  const rquestParmas = {
    page,
    size,
  };
  const query = {
    ...searchProduct,
  };
  ContactModel.getpagination(query, rquestParmas).then((result) => {
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

module.exports.findContactByid = async (req, res) => {
  const cateId = req.query.id;
  console.log(cateId,'--->???')
  if (ObjectId.isValid(cateId)) {
    const resulte = await ContactModel.findById(cateId);
    return res
      .send({ code: 200, message: 'sucess', data: resulte })
      .status(200);
  }else{
    res.send({ code: 300, message: 'failed', })
    .status(300);
  }
};

// module.exports.findContactNew = async (req, res) => {
//   const isContact = req.query.is_contact;
//   console.log(cateId,'--->???')
//   if (ObjectId.isValid(cateId)) {
//     const resulte = await ContactModel.findById(cateId);
//     return res
//       .send({ code: 200, message: 'sucess', data: resulte })
//       .status(200);
//   }else{
//     res.send({ code: 300, message: 'failed', })
//     .status(300);
//   }
// };

module.exports.updateContact = async (req, res) => {
  const { id } = req.body;

  const dataValidate = await validDataUpdate(id, req);
  if (dataValidate?.code === 300) {
    return res.send({
        code: 300,
        message: dataValidate?.message,
      })
      .status(300);
  }
  ContactModel.updateOne({_id:ObjectId(id)}, {$set: dataValidate})
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

module.exports.deleteContact = async(req,res)=> {
  const id = req.query.id;
  if(ObjectId.isValid(id)){
    ContactModel.deleteOne({_id:ObjectId(id)},(err,result)=>{
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
  const contact = {
    date_created: new Date(),
  };

  if(req.body.email){
    const validateEmail = validator.validate(req.body?.email);
    if (validateEmail) {
      contact.email = req.body.email;
    }
     else{
      return {code: 300, message: 'Không đúng định dạng email, vui lòng kiểm tra lại'}
    }
  }
  contact.desc = req.body?.desc;
  contact.address = req.body?.address;
  contact.is_contact = 0;
  contact.username = req.body?.username;

  let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  if(req.body?.phone_number){
    if (vnf_regex.test(req.body?.phone_number)) {
      contact.phone_number = req.body?.phone_number;
    } else {
      return {
        code: 300,
        message: 'Không đúng định dạng số điện thoại, vui lòng kiểm tra lại',
      };
    }
  }

  return contact;
}

function validDataUpdate(id, req) {
  if (!ObjectId.isValid(id)) {
    return { code: 300, message: 'Định danh không hợp lệ!' };
  }
  if (Object.keys(req.body).length === 0) {
    return { code: 300, message: 'Vui lòng nhập nhập lại dữ liệu!' };
  }
  const contact = {
    date_updated: new Date(),
  };

  if (req.body?.email) {
    const validateEmail = validator.validate(req.body?.email);
    if (validateEmail) {
      contact.email = req.body.email;
    } else {
      return {
        code: 300,
        message: 'Không đúng định dạng email, vui lòng kiểm tra lại',
      };
    }
  }
  // contact.desc = req.body?.desc;
  // contact.address = req.body?.address;
  // contact.is_contact = 0;
  // contact.username = req.body?.username;

  if (req.body?.desc) {
    contact.desc = req.body?.desc;
  }
  if (req.body?.address) {
    contact.address = req.body?.address;
  }
  if (req.body?.url_youtube) {
    contact.url_youtube = req.body?.url_youtube;
  }
  if (req.body?.address) {
    contact.address = req.body?.address;
  }
  if (req.body?.is_contact) {
    contact.is_contact = req.body?.is_contact;
  }

  if (req.body?.username) {
    contact.username = req.body?.username;
  }
  
  let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  if (req.body?.phone_number) {
    if (vnf_regex.test(req.body?.phone_number)) {
      contact.phone_number = req.body?.phone_number;
    } else {
      return {
        code: 300,
        message: 'Không đúng định dạng số điện thoại, vui lòng kiểm tra lại',
      };
    }
  }
  console.log(contact,'===???datae')
  return contact;
}
