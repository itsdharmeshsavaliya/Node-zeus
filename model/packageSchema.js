var mongoose = require("mongoose");
var packageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priceTitle: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },    
    lbe: {
        type: String,
        required: true
    },
    cw: {
        type: String,
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model("package", packageSchema);