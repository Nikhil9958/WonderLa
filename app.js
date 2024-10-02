const express = require('express');
const app = express();

const mongoose = require('mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLa"
const Listing = require('./models/listing.js');

const path = require('path');

app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

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

app.get('/listings',async (req,res)=>{ // to get all listings
    const allListings = await Listing.find();
    res.render('./listings/index.ejs',{allListings});
})

app.get('/listings/new',(req,res)=>{  //new route
    res.render('listings/new.ejs');
})

app.get('/listings/:id',async(req,res)=>{  //show route
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing})
})

app.post('/listings',async(req,res)=>{
    const {title,description,image,price,location,country} = req.body;
    let newListing = new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country,
        image:image
    });
    console.log(newListing);
    await newListing.save();
    console.log("new listing saved");
    res.redirect('/listings');
})



// app.get('/testListings',async(req,res)=>{ // for sample data
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"California",
//         country:"USA"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful");
// })

app.listen(8080,()=>{
    console.log("Server is Listening to port 8080");
})
