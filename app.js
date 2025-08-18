const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');


app.set("view engine", "ejs");
app.set("views", path.join( __dirname, "./views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("db is connected...");
})
.catch((err)=>{
    console.log("error connecting to db.", err);
})

app.listen(8080, ()=>{
    console.log("app is listening...");
});

app.get("/", (req,res)=>{
    res.send("this is root path...");
});

app.get("/listings", async (req,res)=>{

    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings } );
});

app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", async (req,res)=>{

    let {id} = req.params;
    const showListing = await Listing.findById(id);
    res.render("./listings/show.ejs", {showListing});

});

app.post("/listings", async (req, res)=>{

    const listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings"); 
});

app.get("/listings/:id/edit", async (req,res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
});

app.put("/listings/:id" , async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , req.body.listing, { new:true , runValidators:true });
    res.redirect("/listings");
});

app.delete("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted Listing : ", deletedListing);
    res.redirect("/listings");
});