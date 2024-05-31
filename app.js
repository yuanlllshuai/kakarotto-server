const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
//const router = require('./router');
const app = express();

app.use(express.urlencoded());
app.use(express.json());
// 跨域
app.use(cors());
// 日志
app.use(morgan('dev'));
//处理静态资源
app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

//app.use('/api/v1', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('hhhhh')
}) 
