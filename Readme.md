# DiskLovers - Orders Service

The Orders Microservice of the DiskLovers application provides capabilities to place Orders for Inventory items added to user Shopping Carts.

## Pre-requisites

This microservice uses its own MongoDB Database. This must be running (such as in a Docker container) before starting the microservice.

### Running MongoDB as a Docker container

1. Run the following command to start MongoDB as a Docker container locally (if not already running), listening on Port 27017:

```
docker run --name disk-lovers-inventory -p 27017:27017 -d mongo:latest
```

By default, this Microservice uses a MongoDB database named `disk-lovers-order-service`, and stores Orders in a Collection named `orders`.

## Launching the Orders Microservice

In a terminal/console window, ensure you are in the project directory, and run the following command:

```
node app.js
```

The microservice is now running locally on port `3004`.

# Using the Orders Microservice (RESTful API Reference)

The following are sample `curl` commands that can be executed from a terminal/console window to interact with the Orders Microservice - the commands demonstrate the RESTful API exposed:

1. Create/Add an Order (where the JSON object `{"userId": "1234"}` is the Order body to be added in this example - there is currently no validation on what data this JSON object contains, but it **MUST** contain an attribute named `userId`, which **MUST** be of type Integer):

    ```
    curl -X POST localhost:3004/orders -d '{"userId": 1234}'
    ```

    **Note:** All Orders added to the Inventory are assigned a randomly generated ID as part of the order body automatically - do not attempt to specify your own. You can see the assigned IDs with the List all command (see Step 2 below). 
    
    **Orders are created with an attribute named `confirmed` automatically, which is set to `false`.**

2. List all Orders:

    ```
    curl localhost:3004/orders -H 'Accept: application/json'
    ```

3. Get a specific Order by Order ID (where `603d073749e21c57eb5e7d1e` is the ID in this example):

    ```
    curl localhost:3004/orders/603d073749e21c57eb5e7d1e -H 'Accept: application/json'
    ```
   
4. Get a specific Order by User ID AND Order ID (where `1234` is the User ID and `603d073749e21c57eb5e7d1e` is the Order ID, in this example):

    ```
    curl localhost:3004/orders/1234/603d073749e21c57eb5e7d1e -H 'Accept: application/json'
    ```
   
   **For this command, the Order must belong to the specified User. In other words, the `userId` attribute of the Order being fetched by ID must match the User ID specified in the URL - if they do not match, a HTTP 404 Not Found error will be returned instead.**
   
5. Confirm an Order (i.e. confirm the successful purchase) by User ID AND Order ID (where `1234` is the User ID and `603d073749e21c57eb5e7d1e` is the Order ID, in this example):

    ```
    curl -X PATCH localhost:3004/1234/603d073749e21c57eb5e7d1e
    ```
   **This command updates the Order object, setting the `confirmed` attribute to `true`.** The User ID is required because only the User who owns/created the Order should be able to carry out the final purchase. If the User ID does not match the specified Order, this will return a HTTP 404 Not Found error.

6. Delete an Order by its ID (where `603ccaf7f9493727f08e9d95` is the ID in this example):

    ```
    curl -X DELETE localhost:3004/orders/603d073749e21c57eb5e7d1e
    ```