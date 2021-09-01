const express = require('express');
const router = express.Router();

require('./routes/categoryRoute').connect(router);
require('./routes/userRoute').connect(router);
require('./routes/productRoute').connect(router);
require('./routes/uploadRoute').connect(router);
require('./routes/authRoute').connect(router);
require('./routes/cartRoute').connect(router);
require('./routes/webSetting').connect(router);
require('./routes/contactRoute').connect(router);
require('./routes/aboutRoute').connect(router);
require('./routes/gallerRoute').connect(router);
module.exports = router