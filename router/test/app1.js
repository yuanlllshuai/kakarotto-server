const express = require('express');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const app = express();
// app.use(express.urlencoded());
app.use(express.json());

app.get('/', async function (req, res) {
    try {
        const back = await readFile('./db.json', 'utf8');
        const data = JSON.parse(back);
        res.send(data.users);
    } catch (err) {
        res.status(500).json({ err })
    }
})

app.post('/', async function (req, res) {
    let body = req.body;
    if (!body) {
        res.status(403).json({ err: '缺少用户信息' })
    }
    const back = await readFile('./db.json', 'utf8');
    const data = JSON.parse(back);
})

app.put('/:id', async function (req, res) {
    try {
        const id = Number.parseInt(req.params.id);

    } catch (error) {
        res.status(500).json({ err })
    }
});

app.use((req,res,next)=>{
    res.status(404).send('404 Not Found')
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send('service error')
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('hhhhh')
})