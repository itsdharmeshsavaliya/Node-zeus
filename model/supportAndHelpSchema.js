var mongoose = require("mongoose");
var supportAndHelpSchema = mongoose.Schema({
    email: {
        type: String,
        default: ""
    },
    fullname: {
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
    messageByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true })

module.exports = mongoose.model("supportAndHelp", supportAndHelpSchema);