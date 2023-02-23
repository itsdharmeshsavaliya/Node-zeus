var mongoose = require("mongoose");
var usersPackagePurchaseSchema = mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true 
    },
    packageID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'package',
        required: true 
    },
    transactionID: {
        type: String,
        required: true
    }    
}, { timestamps: true })
module.exports = mongoose.model("usersPackagePurchase", usersPackagePurchaseSchema);