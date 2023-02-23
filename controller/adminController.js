
var adminSchema = require("../model/adminSchema");
var { secretKey } = require("../keys/keys").url;
var bcrypt = require("bcryptjs");
var JWT = require("jsonwebtoken");

/**
  @route /admin
  @desc Admin Testing Route
  @access Public
**/
exports.adminTestingRoute = (req, res, next) => {
  res.json({ message: "Admin testing api", user: req.user })
}

/**
  @route /admin/login
  @desc Admin Login Route
  @access Public
**/
exports.adminLoginRoute = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username) return res.json({ message: "Enter username!", status: 0 })
    if (!password) return res.json({ message: "Enter password!", status: 0 })
    if (username && password) {
        try {
            let admin = await adminSchema.findOne({ username })
            // START Uncomment when admin collection is empty
            // if(!admin) { 
            //     const salt = await bcrypt.genSalt(10);  // OR const salt = await bcrypt.genSaltSync(10);            
            //     let adminPassword = await bcrypt.hash("admin@zeus", salt);
            //     admin = new adminSchema({ username: "admin", password: adminPassword })
            //     admin.save();
            // }
            // END
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                if (match) {
                    const token = await JWT.sign({ id: admin._id }, secretKey, {
                        expiresIn: "48h",
                    });
                    req.header("auth-token", token);
                    res.json({ message: "User login successfully", status: 1, admin, token });
                } else {
                    res.json({ message: "Incorrect password!", status: 0 });
                }
            } else {
                res.json({ message: "Invalid username!", status: 0 });
            }
        } catch (error) {
            res.json({ message: error.message, status: 0 });
        }
    }
}

/**
* @route Post /user/changePassword
* @desc  Admin Change Password Route
* @access Private
**/
exports.adminChangePasswordRoute = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword) return res.json({ message: "Enter old password!", status: 0 });
  if (!newPassword) return res.json({ message: "Enter new password", status: 0 });  
  if (oldPassword && newPassword) {
        try {
            let admin = await adminSchema.findOne({ username: "admin" });
            if(!admin) return res.json({ message: "Unauthorized access!", status: 0 })
            const match = await bcrypt.compare(oldPassword, admin.password);
            if (match) {
                await bcrypt.genSalt(10, async (err, salt) => {
                    if (err) return res.json({ message: "Something went wrong, please try again!", status: 0 });
                    await bcrypt.hash(newPassword, salt, async (err, hash) => {
                        if (err) return res.json({ message: "Something went wrong, please try again!", status: 0 });

                        await adminSchema.findOneAndUpdate({ _id: admin._id }, { password: hash}).then((data) => {
                            res.json({ message: "Password reset successfully", data, status: 1 });
                        }).catch(() => 
                            res.json({ message: "Internal server error!", status: 0 })
                        );
                    });
                });
            } else {
               res.json({ message: "Invalid old password!", status: 0 });
            }
        } catch (error) {
            res.json({ message: error.message, status: 0 })
        }
    }
};
