const express = require('express')
const app = express()
const port = 3004

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const url = 'mongodb://localhost:27017';
const dbName = 'disk-lovers-order-service';
const client = new MongoClient(url, { useUnifiedTopology: true });
let db;
let collection;

const bodyParser = require('body-parser');
app.use(bodyParser.json())

client.connect(function() {
    console.log('Connected successfully to server');

    db = client.db(dbName);
    collection = db.collection('orders');
});

app.get('/orders', async (req, res)  =>{
    await collection.find({}).toArray()
        .then((result) => {
            //console.debug(result)
            res.status(200).json(result)
        })
        .catch((error) => {
            console.log('An error occurred while fetching the list of orders', error);
            res.status(500).send('Error Fetching Orders\n')
        });
})

app.get('/orders/:id', async (req, res) => {
    await collection.find({'_id': ObjectID(req.params.id)}).toArray()
        .then((result) => {
            //console.debug(result)
            let order;
            let status;
            if (result[0]) {
                order = result[0];
                status = 200;
            } else {
                status = 404;
            }
            return res.status(status).json(order);
        })
        .catch((error) => {
            console.log('An error occurred while fetching the order', error);
            res.status(500).send('Error Fetching Order\n')
        });
})

app.get('/orders/:userId/:id', async (req, res) => {
    let userId = parseInt(req.params.userId)
    await collection.find({'_id': ObjectID(req.params.id), 'userId': userId}).toArray()
        .then((result) => {
            //console.debug(result)
            let order;
            let status;
            if (result[0]) {
                order = result[0];
                status = 200;
            } else {
                status = 404;
            }
            return res.status(status).json(order);
        })
        .catch((error) => {
            console.log('An error occurred while fetching the user\'s order', error);
            res.status(500).send('Error Fetching User Order\n')
        });
})

app.post('/orders/:cart', async (req, res) => {
    let cart = req.body;
    let order = {
        userId: cart.userId,
        confirmed: false
    };

    await collection.insertOne(order)
        .then((result) => {
            console.log('Inserted order into the collection');
            //console.debug(result)
            res.status(201).send('Created Order\n')
        })
        .catch((error) => {
            console.log('An error occurred while inserting order into the collection', error);
            res.status(500).send('Error Saving Order\n')
        });
})

app.patch('/orders/:userId/:id', async (req, res) => {
    let userId = parseInt(req.params.userId)
    await collection.updateOne(
        {'_id': ObjectID(req.params.id), 'userId': userId},
            {$set: {'confirmed': true}}
        ).then((result) => {
            //console.debug(result)
            console.log('Updated order to set confirmed as true in collection');
            //console.debug(result)
            res.status(200).send('Confirmed Order\n')
        })
        .catch((error) => {
            console.log('An error occurred while updating the order in the collection to set confirmed to true', error);
            res.status(404).send('Error Confirming Order\n')
        });
})

app.delete('/orders/:id', async (req, res)  => {
    await collection.deleteOne({'_id': ObjectID(req.params.id)})
        .then((result) => {
            //console.debug(result)
            console.log('Deleted order from the collection');
            //console.debug(result)
            res.status(200).send('Deleted Order\n')
        })
        .catch((error) => {
            console.log('An error occurred while deleting the order', error);
            res.status(404).send('Error Deleting Order\n')
        });
})

app.listen(port, () => {
    console.log(`Ordering Service listening at http://localhost:${port}`)
})
