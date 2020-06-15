/**
*@author: Judith Bresser, 459 956
*@version: 5.2,
*
*/
//****various Linter configs****
// jshint esversion: 8
// jshint browser: true
// jshint node: true
// jshint -W097
"use strict";


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////ÜBUNG 5////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

const express = require('express'); // importiert die express-library
const mongodb = require('mongodb');
const port=3000;

const app = express(); // Express-Instanz, ein App-Objekt wird erstellt

/**
* function which creates a Connection to MongoDB. Retries every 3 seconds if noc connection could be established.
*/
async function connectMongoDB() {
  try {
    //connect to database server
    app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true });
    //connect do database "itemdn"
    app.locals.db = await app.locals.dbConnection.db("itemdb");
    console.log("Using db: " + app.locals.db.databaseName);
  }
  catch (error) {
    console.dir(error);
    setTimeout(connectMongoDB, 3000);
  }
}
//Start connecting
connectMongoDB();

//Make all Files stored in Folder "public" accessible over localhost:3000/public
app.use('/public', express.static(__dirname + '/public'));

//Share jquery over the server
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

//Send index.html on request to "/"
app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');  // Antwortmethode (File)
});

//Send index2.html on request to "/page2"
app.get('/page2', (req,res) => {
  res.sendFile(__dirname + '/index2.html');  // Antwortmethode (File)
});

//Get-Request to /hello will be answerde with "Hello World"
app.get('/hello', (req, res) => {
  res.send('Hello World'); // Antwortmethode (Text)
});

// res.json({ some: 'json' }) //Antwortmethode (JSON)

//Returns all items stored in collection items
app.get("/item", (req,res) => {
    //Search for all items in mongodb
    app.locals.db.collection('items').find({}).toArray((error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});

//Handler for Post requests to "/item"
app.post("/item", (req, res) => {
    // insert item
    console.log("insert item " + JSON.stringify(req.body));
    app.locals.db.collection('items').insertOne(req.body, (error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});

// listen on port 3000
app.listen(port,
  () => console.log(`Example app listening at http://localhost:${port}`)
  ); // Webserver starten
