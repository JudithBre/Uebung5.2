/**
*@author: Judith Bresser, 459 956
*@version: 6.0,
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

const express = require('express'); // imports the express library
const mongodb = require('mongodb');
const port=3000;

const app = express(); // Express instance
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//Share leaflet over the server
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'));

//Share leaflet-draw over the server
app.use('/leaflet-draw', express.static(__dirname + '/node_modules/leaflet-draw/dist'));

//Share leaflet-draw over the server
app.use('/leaflet-heat', express.static(__dirname + '/node_modules/leaflet.heat/dist'));

//Share jquery over the server
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

app.use('/src', express.static(__dirname + ''));

//Send index.html on request to "/"
app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');  // Antwortmethode (File)
});

//Send index2.html on request to "/page2"
app.get('/page2', (req,res) => {
  res.sendFile(__dirname + '/index2.html');  // Antwortmethode (File)
});

// res.json({ some: 'json' }) //Antwortmethode (JSON)

//Returns all items stored in collection items
app.get("/item", (req,res) => {
  //Search for all items in mongodb
  console.log("get item " + req.query._id);
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

//Handler for Put requests to "/item"
app.put("/item", (req, res) => {
  // update item
  console.log("update item " + req.body._id);
  let id = req.body._id;
  delete req.body._id;
  console.log(req.body); // => { name:req.body.name, description:req.body.description }
  app.locals.db.collection('item').updateOne({_id:new mongodb.ObjectID(id)}, {$set: req.body}, (error, result) => {
    if(error){
      console.dir(error);
    }
    res.json(result);
  });
});

// Handler for Delete a item from a database
app.delete("/item", (req, res) => {

  console.log("delete item " + (req.body._id));
  req.body = {_id: new mongodb.ObjectID(req.body._id)};
  console.log("mongo id ");

  console.log(req.body);

  app.locals.db.collection('items').deleteOne(req.body, (error, result) => {
    if (error) {
      console.dir(error);
    }
    res.json(result);
  });
});

// listen on port 3000
app.listen(port,
  () => console.log(`Example app listening at http://localhost:${port}`)
  ); // Start web server
