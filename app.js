const express = require('express');
const app = express();

const mongoose = require('mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLa"

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get('/',(req,res)=>{
    res.send("Hi, I am root");
})

const Listing = require('./models/listing.js');
app.get('/listings',async(req,res)=>{ 
    // let sampleListing = new Listing({
    //     title:"My new Villa",
    //     description:"By the Beach",
    //     price:1200,
    //     location:"California",
    //     country:"USA"
    // })
    // await sampleListing.save();
    console.log("sample was saved");
    res.send("Successful");
})

app.listen(8080,()=>{
    console.log("Server is Listening to port 8080");
})
