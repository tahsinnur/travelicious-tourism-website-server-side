const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qfoh5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('traveliciousTravels');
        const servicesCollection = database.collection('services');
        const tourPackagesCollection = database.collection('tourPackages');
        const bookingInfoCollection = database.collection('bookingInfo');


        // GET API For Tour Packages
        app.get('/tourPackages', async(req, res) => {
            const cursor = tourPackagesCollection.find({});
            const tourPackages = await cursor.toArray();
            res.send(tourPackages);
        });

        // GET API For Services
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET A SINGLE PACKAGE
        app.get('/tourPackages/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tourPackage = await tourPackagesCollection.findOne(query);
            res.json(tourPackage);
        });

        // GET API For Booking Info
        app.get('/bookingInfo', async(req, res) => {
            const cursor = bookingInfoCollection.find({});
            const bookingInfo = await cursor.toArray();
            res.send(bookingInfo);
        });

        // GET SINGLE Booking Info
        app.get('/bookingInfo/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const bookingInfo = await bookingInfoCollection.findOne(query);
            res.json(bookingInfo);
        })

        // POST API For Booking
        app.post('/bookingInfo', async (req, res) => {
            const bookingInfo = req.body;
            console.log(bookingInfo);

            const result = await bookingInfoCollection.insertOne(bookingInfo);
            console.log(result);
            res.send(result);
        });

         // POST API For Add New Package
         app.post('/tourPackages', async (req, res) => {
            const tourPackage = req.body;
            console.log(tourPackage);

            const result = await tourPackagesCollection.insertOne(tourPackage);
            console.log(result);
            res.send(result);
        });

        // DELETE API
        app.delete('/bookingInfo/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingInfoCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Travelicious Travels Server');
});

app.listen(port, () => {
    console.log('Running Travelicious Server on port', port);
})