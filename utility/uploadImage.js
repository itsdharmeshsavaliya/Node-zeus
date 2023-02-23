var multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads');
    },
    filename: function(req, file, cb) {
        let modifiedname = `image-${Date.now() + path.extname(file.originalname)}`;
        cb(null, modifiedname);
    }
});

const upload = multer({
    storage: storage,
});

module.exports = upload;