import app from './app.js';
import dotenv from 'dotenv';
import database from './db/db.js'
dotenv.config()
console.log(process.env.PORT)
const port = process.env.PORT || 3000;
database();
app.listen(9000, (err)=>{
    if(err) throw err;
    console.log('server start');
})