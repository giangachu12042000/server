const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const db = require('./db.js');
const cors = require('cors');
const _ = require('lodash');
// const Bcrypt = require('bcryptjs');
require('dotenv/config') ; 
// const path = require('path');
const fileUpload  = require('express-fileupload');

const api = require('./server/api');

const PORT = process.env.PORT || 4000;
// dotenv.config();

db.ready.then(()=>{
    app.use(bodyParser.json({ limit: "50mb", extended: true })); 

    if (process.env.NODE_ENV !== "production"){
        app.use(
            cors({
                origin: "http://localhost:3000",
                optionsSuccessStatus: 200
            })
        );
    }
    app.use(
        bodyParser.urlencoded({
            limit: "50mb",
            extended: true,
            parameterLimit: 10000
        })
    );
    // app.use(fileUpload());

    app.use('/api',api);
})

app.listen(PORT, err => {
    console.log('port_',PORT)
})