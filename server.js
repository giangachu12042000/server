const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db.js');
const cors = require('cors');
const _ = require('lodash');
const Bcrypt = require('bcryptjs');
const dotenv = require('dotenv') ; 
const path = require('path');
const api = require('./server/api');

dotenv.config();

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
            parameterLimit: 100000
        })
    );
    app.use('/api',api);
})

app.listen(4000, err => {
    console.log('listening...')
})