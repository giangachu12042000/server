const mongoose = require('mongoose');
const chalk = require('chalk');

const connectM = async ()=> {
    try{
        await mongoose.connect('mongodb://localhost/M10SHOP', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          });
        console.log('connect to db successfull',chalk.green('ok'))
        return true
    }catch(err){
        console.log('connect to db error',chalk.red('failed'))
    }
}
const ready = connectM();
module.exports = {
    ready
}