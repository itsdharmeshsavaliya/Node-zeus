var mongoose = require("mongoose");
var searchDataSchema = mongoose.Schema({
    searchKeyword: {
        type: String,
        default: ""
    },
    searchByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    searchAnalyticsData: { type: mongoose.Schema.Types.ObjectId, ref: 'analyticsData' },
    date: { type: Date, default: Date.now }
}, { timestamps: true })
module.exports = mongoose.model("searchDataHistory", searchDataSchema);