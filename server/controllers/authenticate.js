
const User = require("../models/userModel");
const Jwt = require("jsonwebtoken");
// const MailService = require("../lib/mail/service/mail.service");
const Bcrypt = require("bcryptjs");
const Moment = require("moment");
const { lowerCase } = require("lower-case");
const _ = require("lodash");
const config = require("../config/config");
const bcrypt = require('bcryptjs')

const getToken = tokenData => {
  return Jwt.sign(tokenData, config.privateKey, {
    expiresIn: 86400 // expires in 24 hours
  });
};

module.exports.signin = (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    return User.findOne({ email: lowerCase(email) }).then((user, err) => {
      if (err) {
        return res
          .send({
            code: 0,
            message: `Error retrieving user : ${err}`,
            data: {}
          })
          .status(200);
      }
      if (user && user.password) {
        return Bcrypt.compare(password, user.password).then((result, err) => {
          if (err) {
            return res
              .send({
                code: 0,
                message: "Bcrypt comparison error",
                data: {}
              })
              .status(200);
          }
          if (result) {
            const tokenData = {
              id: user._id,
              name: user.name,
              email: user.email,
            };

            const token = getToken(tokenData);
            return res
              .send({
                code: 1,
                message: "Login Successful!",
                data: { user: tokenData, token: token }
              })
              .status(200);
          } else {
            return res
              .send({
                code: 0,
                message: "Bad credentials",
                data: {}
              })
              .status(200);
          }
        });
      } else {
        return res
          .send({
            code: 0,
            message: "Bad credentials",
            data: {}
          })
          .status(200);
      }
    });
  } catch (err) {
    return res
      .send({
        code: 0,
        message: `Error is : ${err}`,
        data: {}
      })
      .status(200);
  }
};

module.exports.getAuthenticated =(req, res)=>
{
    if(req.headers && req.headers.authorization){
      let token = req.headers.authorization;
      if(token.startsWith("Bearer ")){
        token = token.slice(7,token.length);
      }
      Jwt.verify(token,config.privateKey,(err,decoded)=>{
        if(err){
          res.send({message: "Unauthorized user"}).status(401)
        }else{
          User.findOne({_id:decoded.id})
          .then(user=>{
            const userData = {
              _id:user.id,
              name:user.name,
              email:user.email,
              date_created:user.date_created,
              date_updated:user.date_updated
            }
            res.send({message: "Authen user", data: { user: userData, token }, code: 1}).status(200)
          })
        }
      })
    }else{
      res.send({message: "Unauthorized user"}).status(402)
    }
}
