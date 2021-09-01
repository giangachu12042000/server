const WebSettingController = require('../controllers/webSetting');

const multer  = require('multer');
// const upload = multer( {dest: './upload/setting/'}).single('logo');
let upload = multer({
    dest: './upload/setting/',
    fileFilter: (req,file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb("không đúng định dạng: image/jpeg, image/gif, image/png, image/jpg", false);
      }
    },
});

const webSettingRouter =(router)=> {
    router.post('/web-setting/create',upload.single('logo'), WebSettingController.createWebSeting);
    router.get('/web-setting/fetch-all', WebSettingController.fetchAll);
    router.get('/web-setting/get-websetting', WebSettingController.findByWebSettingId);
    router.put('/web-setting/edit-websetting',upload.single('logo'), WebSettingController.updateWebSetting);
    router.delete('/web-setting/delete', WebSettingController.deleteWebSetting);
}

module.exports.connect = webSettingRouter;