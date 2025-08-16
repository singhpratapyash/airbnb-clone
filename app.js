const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join( __dirname, "./views"));

app.use(express.urlencoded({extended:true}));

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
    res.render("new.ejs");
});

app.get("/listings/:id", async (req,res)=>{

    let {id} = req.params;
    const showListing = await Listing.findById(id);
    res.render("./listings/show.ejs", {showListing});

});

app.post("/listings", (req, res)=>{

    const data = req.body.listing;
    console.log(data);

});