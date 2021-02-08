const express = require('express')
const app = express()
const port = 3004

const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const orders = [];

app.listen(port, () => {
    console.log(`Ordering Service listening at http://localhost:${port}`)
})

app.get('/orders', function (req, res) {
    res.status(200).json(orders)
})

app.get('/orders/:id', function (req, res) {
    let order;
    let status = 404;
    for (let index = 0; index < orders.length; index++) {
        if (orders[index].id === req.params.id) {
            order = orders[index];
            status = 200;
            break;
        }
    }
    return res.status(status).json(order);
})

app.get('/orders/:userId/:id', function (req, res) {
    let order;
    let userId = parseInt(req.params.userId);
    let status = 404;
    for (let index = 0; index < orders.length; index++) {
        if (orders[index].id === req.params.id) {
            if (orders[index].userId === userId) {
                order = orders[index];
                status = 200;
                break;
            }
        }
    }
    return res.status(status).json(order);
})

app.post('/orders/:cart', function (req, res) {
    let cart = req.body;
    let order = {
        id: uuidv4(),
        userId: cart.userId,
        confirmed: false
    };
    orders.push(order);
    res.status(201).send('Created Order\n')
})

app.patch('/orders/:userId/:id', function (req, res) {
    let order;
    let userId = parseInt(req.params.userId)
    let status = 404;
    for (let index = 0; index < orders.length; index++) {
        if (orders[index].id === req.params.id) {
            if (orders[index].userId === userId) {
                orders[index].confirmed = true;
                order = orders[index];
                status = 200;
                break;
            }
        }
    }
    return res.status(status).json(order);
})

app.delete('/orders/:id', function (req, res) {
    let order;
    let status = 404;
    for (let index = 0; index < orders.length; index++) {
        if (orders[index].id === req.params.id) {
            order = orders[index];
            orders.splice(index, 1);
            status = 200;
            break;
        }
    }
    return res.status(status).json(order);
})
