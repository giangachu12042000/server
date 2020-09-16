const Cart = require('../controllers/cartController')

function connectCart(router){
    router.post('/cart/create', Cart.newCart);
    router.get('/cart/fetch-all', Cart.fetchAll);
    router.put('/cart/edit', Cart.updateCart);
    router.delete('/cart/delete',Cart.deleteCart)
}

module.exports.connect = connectCart