const express = require('express');
var cors = require('cors')
require('dotenv').config();
const dbConnect = require('./services/dbconnect');
const routes = require('./Routes/routes')
const app = express();
app.use(cors())
app.options('*', cors())
app.use(express.urlencoded({ extended: false }))

app.use('/',routes)

dbConnect(process.env.DB_CONNECTION_STRING).then((data) => {
    console.log('Connected to db successfully')
    app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
}).catch(err=>{
    console.log('DB connection error.');
    console.log(err);
})
