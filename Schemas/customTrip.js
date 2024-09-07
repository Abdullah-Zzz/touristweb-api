const mongoose = require("mongoose")

const placeSchema = new mongoose.Schema({
    value: String,
    selected: Boolean,
    id: Number,
    price: Number,
    perRoom: Number,
    perDay: Number,
    places: [{
        id: Number,
        name: String,
        price: Number,
        perRoom: Number,
        perDay: Number,
        selected: Boolean
    }]
});

const Place = mongoose.model('DataCustomPackage', placeSchema);

module.exports = Place;
