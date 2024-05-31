const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://127.0.0.1:27017');
const main = async () => {
    await client.connect();
    const db = client.db('mydb');
    const ff = db.collection('ff');
    const d = await ff.find();
    console.log(await d.toArray());
}

main().finally(() => client.close())
