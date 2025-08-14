const express = require("express");
const app = express();
const mongoose = require("mongoose");

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
})