const express = require("express");
const cors = require("cors");
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const util = require('util');
const fileUpload = require('express-fileupload');
var serveIndex = require('serve-index')

const connection = require("./database/database.js");

const app = express();

app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'), serveIndex('uploads', {'icons': true}))


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json({ limit: '100mb' }));

//enable cors for all requests
app.use(cors());

app.use(fileUpload({
    debug : true,
}));

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '127.0.0.1';


const routes = require('./routes/routes.js');
app.use("/", routes);

app.get('/', (req, res) => {
    res.json({
        message: 'Hello From Express',
    });
});



const server = app.listen(PORT, HOST, () => {
    console.log(`Application running on port ${server.address().port} !`);
    console.log(`http://${server.address().address}:${server.address().port}`);
});



