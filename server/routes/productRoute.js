const Product = require('../controllers/productController');
const Category = require('../controllers/categoryController');

function connectProductController(router)
{
    router.post('/product/create', Product.newProduct);
    router.get('/product/fetch-all', Product.fetchAll);
    router.put('/product/edit/:id', Product.updateProduct);
    router.delete('/product/delete', Product.deleteProduct);
    router.get('/product/find-category', Product.findByCateId);
    router.get('/product/get-category', Category.fetchAll);
}

module.exports.connect = connectProductController