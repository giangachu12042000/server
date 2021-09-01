const GalleryController = require('../controllers/galleryController');

const multer  = require('multer');
// const upload = multer( {dest: './upload/setting/'}).single('logo');
let upload = multer({
    dest: './upload/gallery/',
    fileFilter: (req,file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb("không đúng định dạng: image/jpeg, image/gif, image/png, image/jpg", false);
      }
    },
});

// upload.array('image', 12)
const GalleryRouter =(router)=> {
    router.post('/gallery/create', upload.single('image'), GalleryController.galleryCreate);
    router.get('/gallery/fetch-all', GalleryController.fetchAll);
    router.get('/gallery/get-websetting', GalleryController.findByGallery);
    router.put('/gallery/edit-websetting',upload.single('image'), GalleryController.updateGallery);
    router.delete('/gallery/delete', GalleryController.deleteGallery);
}

module.exports.connect = GalleryRouter;