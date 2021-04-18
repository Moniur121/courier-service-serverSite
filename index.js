const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.fob1y.mongodb.net/${process.env.DV_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());
const port = 5000;

app.get('/', (req, res) =>{
    res.send('hello, i am Mongodb server site');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("courierService").collection("service");
  const serviceDetailsCollection = client.db("courierService").collection("serviceDetails");
  const reviewCollection = client.db("courierService").collection("clientReview");
  const adminCollection = client.db("courierService").collection("makeAdmin");
   // perform actions on the collection object
    app.post("/addService",(req,res) => {
         const service = req.body;
         console.log(service);
         serviceCollection.insertOne(service)
         .then(result=>{
             res.send(result)
         })
        
    })

    app.get('/services', (req, res) => {
         
        serviceCollection.find({})
        .toArray((err, documents) => res.send(documents))
         
    })

    app.post('/serviceDetails', (req,res)=>{
        const serviceDetails= req.body;
        serviceDetailsCollection.insertOne(serviceDetails)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
    })
    app.get('/detailService', (req, res) => {
         
        serviceDetailsCollection.find({})
        .toArray((err, documents) => res.send(documents))
         
    })

    app.post('/addReview', (req,res)=>{
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result =>{
          res.send(result.insertedCount>0)
        })
      })
      app.get('/getReview', (req, res) => {
         
        reviewCollection.find({})
        .toArray((err, documents) => res.send(documents))
         
    })

    app.post('/makeAdmin', (req,res)=>{
        const review = req.body;
        adminCollection.insertOne(review)
        .then(result =>{
          res.send(result.insertedCount>0)
        })
      })
   
});

app.listen(process.env.PORT || port);