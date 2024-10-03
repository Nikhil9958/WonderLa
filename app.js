const express = require('express');
const app = express();

const mongoose = require('mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLa"
const Listing = require('./models/listing.js');

const path = require('path');

app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

const methodOverride = require('method-override');
app.use(methodOverride('_method'))

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
    // console.log(listing);
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
        image:{url:image.url}
    });
    console.log(newListing);
    await newListing.save();
    console.log("new listing saved");
    res.redirect('/listings');
})

app.get('/listings/:id/edit',async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("./listings/edit.ejs",{listing})
})

app.put('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    const listing = req.body.listing;
    // console.log(listing);
    await Listing.findByIdAndUpdate(id,{title:listing.title,description:listing.description,image:{url:listing.url},price:listing.price,country:listing.country,location:listing.location},{new:true})
    res.redirect(`/listings/${id}`);
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
