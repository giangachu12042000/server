const Product = require('../controllers/productController');
const Category = require('../controllers/categoryController');

const multer  = require('multer');
// const upload = multer( {dest: './upload/setting/'}).single('logo');
let upload = multer({
    dest: './upload/product/',
    fileFilter: (req,file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb("không đúng định dạng: image/jpeg, image/gif, image/png, image/jpg", false);
      }
    },
});

function connectProductController(router)
{
    router.post('/product/create', upload.single('image'), Product.newProduct);
    router.get('/product/fetch-all', Product.fetchAll);
    router.put('/product/edit', upload.single('image'), Product.updateProduct);
    router.delete('/product/delete', Product.deleteProduct);
    // chưa test
    router.get('/product/find-category', Product.findByCateId);
    router.get('/product/get-category', Category.fetchAll);
}

module.exports.connect = connectProductController