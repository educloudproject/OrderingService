const express = require('express');
const app = express();
const port = 3004;

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017';
const dbName = 'disk-lovers-order-service';
const client = new MongoClient(url, { useUnifiedTopology: true });
let db;
let collection;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

client.connect(function() {
    try {
        db = client.db(dbName);
        collection = db.collection('orders');
        console.log('Connected successfully to database server');
    } catch (error) {
        console.log('Error: Could not connect to database server');
    }
});

app.get('/orders', async (req, res)  => {
    let result;
    let statusCode = 200;
    try {
        result = await collection.find({}).toArray();
        //console.debug(result);
    } catch (error) {
        result = getErrorObject('Error fetching Orders List');
        statusCode = 500;
        console.log('An error occurred while fetching the list of orders', error);
    }
    return res.status(statusCode).json(result);
});

app.get('/orders/:id', async (req, res) => {
    let result;
    let statusCode = 200;
    try {
        result = await collection.findOne({'_id': ObjectID(req.params.id)});
        //console.debug(result);
        if (!result) {
            result = {};
            statusCode = 404;
        }
    } catch (error) {
        result = getErrorObject('Error fetching Order');
        statusCode = 500;
        console.log('An error occurred while fetching the order', error);
    }
    return res.status(statusCode).json(result);
});

app.get('/orders/:userId/:id', async (req, res) => {
    let userId = parseInt(req.params.userId)
    let result;
    let statusCode = 200;
    try {
        result = await collection.findOne({'_id': ObjectID(req.params.id), 'userId': userId});
        //console.debug(result)
        if (!result) {
            result = {};
            statusCode = 404;
        }
    } catch (error) {
        result = getErrorObject('Error fetching User Order');
        statusCode = 500;
        console.log('An error occurred while fetching the user\'s order', error);
    }
    return res.status(statusCode).json(result);
});

app.post('/orders/:cart', async (req, res) => {
    let cart = req.body;
    let order = {
        userId: cart.userId,
        confirmed: false
    };
    let resultMessage = 'Created Order';
    let statusCode = 201;

    try {
        await collection.insertOne(order);
    } catch (error) {
        resultMessage = 'Error saving Order';
        statusCode = 500;
        console.log('An error occurred while inserting order into the collection', error);
    }
    return res.status(statusCode).send(resultMessage);
});

app.patch('/orders/:userId/:id', async (req, res) => {
    let userId = parseInt(req.params.userId)
    let resultMessage = 'Confirmed Order';
    let statusCode = 200;

    try {
        let result = await collection.updateOne(
            {'_id': ObjectID(req.params.id), 'userId': userId},
            {$set: {'confirmed': true}});
        //console.debug(result);
        if (result.result.n === 0) {
            resultMessage = 'Order Not Found';
            statusCode = 404;
        }
    } catch (error) {
        resultMessage = 'Error confirming Order';
        statusCode = 500;
        console.log('An error occurred while updating the order in the collection to set confirmed to true', error);
    }
    return res.status(statusCode).send(resultMessage);
});

app.delete('/orders/:id', async (req, res)  => {
    let resultMessage = 'Deleted Order';
    let statusCode = 200;

    try {
        let result = await collection.deleteOne({'_id': ObjectID(req.params.id)})
        //console.debug(result);
        if (result.deletedCount === 0) {
            resultMessage = 'Order Not Found';
            statusCode = 404;
        }
    } catch (error) {
        resultMessage = 'Error deleting Order';
        statusCode = 500;
        console.log('An error occurred while deleting the order', error);
    }
    return res.status(statusCode).send(resultMessage);
});

app.listen(port, () => {
    console.log(`Ordering Service listening at http://localhost:${port}`)
});

function getErrorObject(message) {
    return {error: message};
}
