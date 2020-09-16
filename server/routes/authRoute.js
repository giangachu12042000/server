const Auth = require('../controllers/authenticate');

function connectAuth(router)
{
    router.post('/auth/login', Auth.signin);
    router.post('/auth/get-sesstion',Auth.getAuthenticated);

}

module.exports.connect = connectAuth