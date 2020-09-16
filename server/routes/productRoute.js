const Product = require('../controllers/productController');

function connectProductController(router)
{
    router.post('/product/create', Product.newProduct);
    router.get('/product/fetch-all', Product.fetchAll);
    router.put('/product/edit', Product.updateProduct);
    router.delete('/product/delete', Product.deleteProduct);
    router.get('/product/find-cate', Product.findByCateId)
}

module.exports.connect = connectProductController