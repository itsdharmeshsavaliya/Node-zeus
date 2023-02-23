const mongoose = require('mongoose');

const { DataBase_URL } = require("../keys/keys").url;

mongoose.connect(DataBase_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Database Connected");
    })
    .catch(() => {
        console.log("Database Not Connected");
    })
