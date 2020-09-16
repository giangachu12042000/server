const {uploadImage} = require('../ultil/muilter');

module.exports.uploadImg = async(req, res)=>
{
    const fileImage = req.file;
    const a = req.body;
    const b = req.query;
    console.log(fileImage,'==?',a,'=====>',b)
}