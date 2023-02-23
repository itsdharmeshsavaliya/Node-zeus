var mongoose = require("mongoose");

var countryNameSchema = mongoose.Schema({

    country_id: {
        type: String,
        default: ""
    },

    nicename: {
        type: String,
        default: ""
    },

    iso: {
        type: String,
        default: ""
    },

    iso3: {
        type: String,
        default: ""
    },

    phonecode: {
        type: String,
        default: ""
    },

    capital: {
        type: String,
        default: ""
    },

    currency: {
        type: String,
        default: ""
    },

    native: {
        type: String,
        default: ""
    },

    region: {
        type: String,
        default: ""
    }
    ,

    subregion: {
        type: String,
        default: ""
    },

}, { timestamps: true })

module.exports = mongoose.model("countryName", countryNameSchema);