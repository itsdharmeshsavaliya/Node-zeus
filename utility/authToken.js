var JWT = require("jsonwebtoken");
var adminSchema = require("../model/adminSchema");

var { secretKey } = require("../keys/keys").url
exports.isLoggedIn = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.json({ message: "Access denied", status: 0 });
    try {
        const verified = JWT.verify(token, secretKey);
        req.user = verified.user;
        next();
    } catch (error) {
        let message = (!req.user) ? "Unauthorized user" : error;
        res.json({ message: message, status: 0 })
    }
}
exports.isadminLoggedIn = async(req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.json({ message: "Access denied", status: 0 });
    let message = "";
    try {
        const verified = await JWT.verify(token, secretKey);
        let adminId = verified.id;
        if (adminId) {
            let admin = await adminSchema.findById(adminId)
            if (admin) {
                req.admin = admin;
                next();
            } else {
                message = "Unauthorized user";
                res.json({ message: message, status: 0 })
            }
        } else {
            message = "Unauthorized user";
            res.json({ message: message, status: 0 })
        }
    } catch (error) {
        message = (!req.admin) ? "Unauthorized user" : error;
        res.json({ message: message, status: 0 })
    }
}