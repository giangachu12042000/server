const User = require('../controllers/userController');

function connectUserController(router)
{
    router.post('/user/create', User.newUser);
    router.get('/user/fetch-all', User.fetchAll);
    router.put('/user/edit', User.updateUser);
    router.delete('/user/delete', User.deleteUser);
    router.put('/user/change-password', User.changePassWord);
}

module.exports.connect = connectUserController