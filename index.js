const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
console.log(uri);
const app = express();
app.use(express.json()); 
 


 
client.connect(err => {
  const procuctsCollection = client.db("organicdb").collection("products");
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  }) 
  app.get('/products', (req, res) => {
    procuctsCollection.find({})
    .toArray( (error, documents) => {
      res.send(documents)
    })
  })



  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    procuctsCollection.insertOne(product)
      .then(data => {
        console.log("one product added");
        res.redirect('/')
      })
  })

  app.delete('/delete/:id', (req, res) => {
    procuctsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
     
      res.send(result.deletedCount > 0)
    })
    console.log(req.params.id);
  })

  app.get('/product/:id', (req, res) => {
    procuctsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((error, documents) => {
      res.send(documents[0])
    })
  })

  app.patch('/update/:id', (req, res) => {
    procuctsCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
      console.log(result);
    })
  })


  // perform actions on the collection object
  // client.close();
});


app.listen(4000)