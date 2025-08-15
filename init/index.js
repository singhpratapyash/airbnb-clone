const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("Database is connected..");
})
.catch((err)=>{
    console.log("error connecting to db.", err);
})

async function initDB(){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("DB was initialised and sample data is inserted.");
}

initDB();
