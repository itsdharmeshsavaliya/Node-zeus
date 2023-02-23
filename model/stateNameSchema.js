var mongoose = require("mongoose");
var stateNameSchema = mongoose.Schema({
    
    state_id: {
        type: String,
        default: ""
    },
    state_name: {
        type: String,
        default: ""
    },
    country_id: {
        type: String,
        default: ""
    }

}, { timestamps: true })

module.exports = mongoose.model("stateName", stateNameSchema);