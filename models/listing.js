const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    price: Number,
    description: String,
    image: {
        filename: {
            type: String,
            default: "listing image"
        },
        url: {
            type: String,
            set: (v) =>
            v === "" 
                ? "https://tse3.mm.bing.net/th/id/OIP.zEjZ_07YiVW6hZzAkOnkrAHaEq?r=0&w=1500&h=945&rs=1&pid=ImgDetMain&o=7&rm=3" 
                : v,
            default: "https://tse3.mm.bing.net/th/id/OIP.zEjZ_07YiVW6hZzAkOnkrAHaEq?r=0&w=1500&h=945&rs=1&pid=ImgDetMain&o=7&rm=3"
        }
    },
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Reviews"
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;