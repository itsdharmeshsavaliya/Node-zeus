var mongoose = require("mongoose");
var analyticsDataSchema = mongoose.Schema({
    searchKeywordType: {
        type: String,
        default: ""
    },
    searchKeyword: {
        type: String,
        default: ""
    },    
    analyticsData: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    },
    checkedStarted: {
        type: Date,
        default: Date.now
    },
    checkedEnd: {
        type: Date,
        default: Date.now
    },
    durationBetweenTime: {
        type: String,
        default: ""
    },
    allUsers: {
        type: Array,
        default: []
    }
}, { timestamps: true })
module.exports = mongoose.model("analyticsData", analyticsDataSchema);