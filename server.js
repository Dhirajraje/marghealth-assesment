const express = require('express');
require('dotenv').config();
const dbConnect = require('./services/dbconnect');
const routes = require('./Routes/routes')
const app = express();
app.use(express.urlencoded({ extended: false }))

app.use('/',routes)



var data = require('./data.json')


app.get('/', (req, res) => {
    // req params pageNumber, pageSize
    // res count, dreq.fileata
    var pageNumber = req.query['pageNumber'] ?? 1;
    var pageSize = req.query['pageSize'] ?? 10;
    console.log(req.query);
    if (pageNumber == 1) {
        var dbData = data.slice(0, Math.min(data.length, pageSize));
    } else {
        console.log(pageSize * (pageNumber - 1));
        console.log(pageSize * pageNumber);
        var dbData = data.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
    }
    var resData = {
        count: data.length,
        data: dbData
    }
    res.send(resData)
})


dbConnect(process.env.DB_CONNECTION_STRING).then((data) => {
    console.log('Connected to db successfully')
    app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
}).catch(err=>{
    console.log('DB connection error.');
    console.log(err);
})
