const Upload = require('../controllers/uploadImageController');

function connectUpload(router){
    router.post('/image/create', Upload.uploadImg);
}
module.exports.connect = connectUpload