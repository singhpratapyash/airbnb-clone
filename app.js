const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingJoiSchema = require("./schema.js")
const Review = require("./models/review.js")

app.set("view engine", "ejs");
app.set("views", path.join( __dirname, "./views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
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

app.get("/", (req, res)=>{
    res.send("this is root path...");
});

const validateListing = (req ,res, next)=>{
    let {error} = listingJoiSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }
    else{
        next();
    }
}

app.get("/listings", wrapAsync(async (req,res)=>{

    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings } );
})
);

app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", wrapAsync(async (req,res)=>{

    let {id} = req.params;
    const showListing = await Listing.findById(id);
    res.render("./listings/show.ejs", {showListing});
})
);

app.post("/listings", validateListing ,wrapAsync(async (req, res, next)=>{

    const listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings"); 
})
);

app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{  
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
})
);

app.put("/listings/:id", validateListing , wrapAsync( async (req,res)=>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , req.body.listing, { new:true , runValidators:true });
    res.redirect("/listings");
})
);

app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted Listing : ", deletedListing);
    res.redirect("/listings");
})
);

app.post("/listings/:id/reviews", async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved.");
    res.redirect(`/listings/${req.params.id}`);
});

// middlewares

app.all( /.*/, (req, res,next)=>{
    next(new ExpressError(404, message="Page not Found...."));

});

app.use( (err, req, res,next) =>{
    let error = err;
    console.log(error);
    let {statusCode = 500, message = "Something went wrong!!!"} = error;
    res.status(statusCode).render("./listings/error.ejs", {error});
} );