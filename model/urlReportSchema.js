var mongoose = require("mongoose");
var urlReportSchema = mongoose.Schema({

    urlName: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    reportByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true })

module.exports = mongoose.model("urlReportSchema", urlReportSchema);