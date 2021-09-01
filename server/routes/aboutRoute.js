const AboutController = require('../controllers/aboutCotroller');

const multer  = require('multer');
// const upload = multer( {dest: './upload/setting/'}).single('logo');
let upload = multer({
    dest: './upload/about_us/',
    fileFilter: (req,file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb("không đúng định dạng: image/jpeg, image/gif, image/png, image/jpg", false);
      }
    },
});

const AboutRouter =(router)=> {
    router.post('/about-us/create',upload.single('image'), AboutController.createAbout);
    router.get('/about-us/fetch-all', AboutController.fetchAll);
    router.get('/about-us/get', AboutController.findAboutByid);
    router.put('/about-us/edit',upload.single('image'), AboutController.updateAboutUs);
    router.delete('/about-us/delete', AboutController.deleteAbout);
}

module.exports.connect = AboutRouter;