const category = require('../controllers/categoryController');

function connectCategory(router)
{
    router.post('/category/create', category.newCategory);
    router.get('/category/fetch-all', category.fetchAll);
    router.put('/category/edit/:id', category.updateCategory);
    router.delete('/category/delete', category.deleteCategory)
}

module.exports.connect = connectCategory