var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        default: ""
    },
    fullname: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        default: ""
    },
    profilePic: {
        type: String,
        default: '/images/def.png'
    },
    password: {
        type: String,
        default: ""
    },
    mobileNo: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    stateID: {
        type: String,
        default: ""
    },
    countryID: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: "",
    },
    loginType: {
        type: String,
        default: "manually"
    },
    authID: {
        type: String,
        default: "",
    },
    registerVerifyOTP: {
        type: String,
        default: "",
    },
    passwordOTP: {
        type: String,
        default: "",
    },
    activeCheck: {
        type: Boolean,
        default: false
    },
    totalBolt: {
        type: Number,
        default: 2 //Give 2 bolt to New user
    }
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema);