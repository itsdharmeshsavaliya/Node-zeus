var userSchema = require("../model/userSchema");
var urlReportSchema = require("../model/urlReportSchema");
var supportAndHelpSchema = require("../model/supportAndHelpSchema");
var analyticsDataSchema = require("../model/analyticsDataSchema");
var usersPackagePurchaseSchema = require("../model/usersPackagePurchaseSchema");

var { adminEmail, adminPassword, secretKey } = require("../keys/keys").url;
const nodemailer = require("nodemailer");
var bcrypt = require("bcryptjs");
var JWT = require("jsonwebtoken");

/**
  @route /user
  @desc user Testing Route
  @access Public
**/
exports.userTestingRoute = (req, res, next) => {
    res.json({ message: "User testing api", user: req.user })
}

/**
  @route /user/userRegister
  @desc user Register Route
  @access Public
**/
exports.userRegisterRoute = (req, res, next) => {
    const { email, password } = req.body;
    let OTP = String(
        Math.floor(Math.random() * (999999 - 10000) + 10000)
    );
    if (!email) {
        return res.json({ message: "Email must be required", status: 0 });
    }
    if (!password) {
        return res.json({ message: "Password must be required", status: 0 });
    }
    const newUser = new userSchema({ email, password })
    userSchema.findOne({ email })
        .then((user) => {
            if (user) {
                if (user.activeCheck === true) return res.json({ message: "Email already exists", status: 0 })
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    secure: true,
                    port: 587,
                    auth: {
                        user: adminEmail,
                        pass: adminPassword,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });

                var mailOptions = {
                    from: adminEmail,
                    to: email.trim(),
                    subject: "OTP Verification Email For Registration.",
                    text: `Your OTP Verification Code is : ${OTP}`,
                };

                transporter.sendMail(mailOptions, (err, info) => {

                    if (err) return res.json({ message: "Something went wrong", status: 0 });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) return res.json({ message: "Something went wrong", status: 0 });
                            user.password = hash;
                            bcrypt.hash(OTP, salt, (err, hash) => {
                                if (err) return res.json({ message: "Something went wrong", status: 0 });
                                user.registerVerifyOTP = hash;
                                user.userID = "zeus" + Date.now();
                                try {
                                    user.save()
                                        .then(() => {
                                            res.json({
                                                message: "Email send successfully",
                                                status: 1,
                                            });
                                        })
                                } catch (err) {
                                    res.json({ message: "Internal server error!", status: 0 })
                                }
                            });
                        });
                    })
                })
            } else {
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    secure: true,
                    port: 587,
                    auth: {
                        user: adminEmail,
                        pass: adminPassword,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });

                var mailOptions = {
                    from: adminEmail,
                    to: email.trim(),
                    subject: "OTP Verification Email For Registration.",
                    text: `Your OTP Verification Code is : ${OTP}`,
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) return res.json({ message: "Something went wrong", status: 0 });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) return res.json({ message: "Something went wrong", status: 0 });
                            newUser.password = hash;
                            bcrypt.hash(OTP, salt, (err, hash) => {
                                if (err) return res.json({ message: "Something went wrong", status: 0 });
                                newUser.registerVerifyOTP = hash
                                newUser.userID = "zeus" + Date.now();
                                try {
                                    newUser.save()
                                        .then(() => {
                                            res.json({
                                                message: "Email send successfully",
                                                status: 1,
                                            });
                                        })
                                } catch (err) {
                                    res.json({ message: "Internal server error!", status: 0 })
                                }
                            });
                        });
                    })
                })
            }
        })
        .catch(() =>
            res.json({ message: "Internal server error!", status: 0 })
        );
}

/**
  @route /user/verifyOTP
  @desc user Verify OTP Route
  @access Public
**/
exports.verifyOTPRoute = (req, res, next) => {
    const { email, OTP, type } = req.body;
    if (!email) {
        return res.json({ message: "Email must be required", status: 0 });
    }
    if (!OTP) {
        return res.json({ message: "OTP must be required", status: 0 });
    }
    if (!type) {
        return res.json({ message: "Type must be required", status: 0 });
    }
    if (type === "register") {
        userSchema.findOne({ email })
            .then((user) => {
                if (!user) return res.json({ message: "Email not found", status: 0 });
                if (user.registerVerifyOTP === "") return res.json({ message: "OTP not match", status: 0 });

                bcrypt.compare(OTP, user.registerVerifyOTP)
                    .then((isMatch) => {
                        if (!isMatch) return res.json({ message: "OTP not match", status: 0 });
                        user.activeCheck = true;
                        user.registerVerifyOTP = "";
                        user.save()
                            .then(() => {
                                res.status(200).json({
                                    message: "User register successfully",
                                    status: 1,
                                });
                            })
                            .catch(() =>
                                res.json({ message: "Internal server error!", status: 0 })
                            );
                    })
                    .catch(() =>
                        res.json({ message: "Internal server error!", status: 0 })
                    );
            })
    } else if (type === "forgotPassword") {
        userSchema.findOne({ email })
            .then((user) => {
                if (!user) return res.json({ message: "Email not found", status: 0 });
                bcrypt.compare(OTP, user.passwordOTP).then((isMatch) => {
                    if (!isMatch)
                        return res
                            .json({ message: "OTP not match", status: 0 });
                    res.json({
                        message: "OTP match successfully",
                        email: user.email,
                        status: 1,
                    });
                });
            })
            .catch(() =>
                res.json({ message: "Internal server error!", status: 0 })
            );
    } else {
        res.json({ message: "Type is not Valid", status: 0 })
    }
}

/**
  @route /user/userLogin
  @desc user Login Route
  @access Public
**/
exports.userLoginRoute = (req, res, next) => {

    const { email, password, loginType, authID } = req.body;

    if (!loginType) {
        return res.json({ message: "Login type must be required", status: 0 });
    } else if (loginType === "manually") {

        if (!email) {
            return res.json({ message: "Email must be required", status: 0 });
        }

        if (!password) {
            return res.json({ message: "Password must be required", status: 0 });
        }

        if (email && password) {

            userSchema.findOne({ email })
                .then((user) => {
                    if (!user)
                        return res
                            .json({ message: "Email not found", status: 0 });
                    if (user.activeCheck === false)
                        return res
                            .json({ message: "Your email is not verified", status: 0 });
                    if (user.loginType === "manually") {
                        bcrypt
                            .compare(password, user.password)
                            .then((isMatch) => {
                                if (!isMatch)
                                    return res
                                        .json({ message: "Password not match", status: 0 });
                                const token = JWT.sign({ user }, secretKey, {
                                    expiresIn: "100h",
                                });
                                req.header("auth-token", token);
                                res.json({ message: "User login successfully", status: 1, token, user });
                            })
                            .catch(() =>
                                res.json({ message: "Internal Server Error!", status: 0 })
                            );
                    } else {
                        res.json({ message: "Email and password is incorrect", status: 0 });
                    }

                })
                .catch(() =>
                    res.json({ message: "Internal server error!", status: 0 })
                );
        }
    } else if (loginType === "facebook" || loginType === "google") {

        if (!authID) {
            return res.json({ message: "AuthID must be required", status: 0 });
        }

        if (!email) {
            return res.json({ message: "Email must be required", status: 0 });
        }
        const userID = "zeus" + Date.now()
        const newUser = new userSchema({ authID, loginType, email, activeCheck: true, userID });
        userSchema.findOne({ email })
            .then((user) => {
                if (user) {
                    if (user.loginType === "manually") return res.json({ message: "Email already exists", status: 0 });
                    const token = JWT.sign({ user }, secretKey, {
                        expiresIn: "100h",
                    });
                    req.header("auth-token", token);
                    res.json({ message: "User loggedin successfully", status: 1, user, token });
                } else {

                    try {
                        newUser
                            .save()
                            .then((user) => {
                                const token = JWT.sign({ user }, secretKey, {
                                    expiresIn: "100h",
                                });
                                req.header("auth-token", token);
                                res.json({ message: "User loggedin successfully", status: 1, user, token });
                            })
                    } catch (err) {
                        console
                        res.json({ message: "Internal server error!", status: 0 })
                    }
                }
            })
            .catch(() => {
                return res.json({ message: "Internal server error!", status: 0 });
            })

    } else {
        return res.json({ message: "Login type is not Valid!", status: 0 });
    }
};

/**
 * @route Post /user/forgotPassword
 * @desc  user forgotPassword Route
 * @access Public
 **/
exports.userForgotPasswordRoute = (req, res, next) => {
    const { email } = req.body;
    let OTP = String(
        Math.floor(Math.random() * (999999 - 10000) + 10000)
    );
    if (!email) {
        return res.json({ message: "Email must be required", status: 0 });
    }
    userSchema.findOne({ email })
        .then((user) => {
            if (!user) return res.json({ message: "Email not found", status: 0 });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(OTP, salt, (err, hash) => {
                    if (err) return res.json({ message: "Something went wrong", status: 0 });
                    user.passwordOTP = hash;
                    user
                        .save()
                        .then((user) => {
                            var transporter = nodemailer.createTransport({
                                service: "gmail",
                                secure: true,
                                port: 587,
                                auth: {
                                    user: adminEmail,
                                    pass: adminPassword,
                                },
                                tls: {
                                    rejectUnauthorized: false,
                                },
                            });

                            var mailOptions = {
                                from: adminEmail,
                                to: email.trim(),
                                subject: "OTP Verification Email For Forgot Password.",
                                text: `Your OTP Verification Code is : ${OTP}`,
                            };
                            transporter.sendMail(mailOptions, (err, info) => {
                                if (err) res.json({ message: "err", err });
                                res.json({
                                    message: "Email send successfully",
                                    status: 1,
                                });
                            });
                        })
                        .catch(() =>
                            res.json({ message: "Internal server error!", status: 0 })
                        );
                });
            });
        })
        .catch(() =>
            res.json({ message: "Internal server error!", status: 0 })
        );

};

/**
 * @route Post /user/resetPassword
 * @desc  user resetPassword Route
 * @access Public
 **/
exports.userResetPasswordRoute = (req, res, next) => {
    const { newPassword, confirmPassword, email, type } = req.body;
    if (!email) {
        return res.json({ message: "Email must be required", status: 0 });
    }
    if (!newPassword) {
        return res.json({ message: "Password must be required", status: 0 });
    }
    if (!confirmPassword) {
        return res.json({ message: "Confirm password must be required", status: 0 });
    }
    if (email && confirmPassword && newPassword) {
        userSchema.findOne({ email })
            .then((user) => {
                if (!user) return res.json({ message: "Email not found", status: 0 });
                if (newPassword !== confirmPassword)
                    return res.json({
                        message: "Your password and confirmation password do not match",
                        status: 0,
                    });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) return res.json({ message: "Something went wrong", status: 0 });
                        user.password = hash;
                        user
                            .save()
                            .then((user) => {
                                res
                                    .json({
                                        message: "Password reset successfully",
                                        user,
                                        status: 1,
                                    });
                            })
                            .catch(() =>
                                res.json({ message: "Internal server error!", status: 0 })
                            );
                    });
                });
            })
            .catch(() =>
                res.json({ message: "Internal server error!", status: 0 })
            );
    }
};

/**
 * @route Post /user/changePassword
 * @desc  user changePassword Route
 * @access Private
 **/
exports.userChangePasswordRoute = (req, res, next) => {
    const { newPassword, confirmPassword, oldPassword } = req.body;
    if (!oldPassword) {
        return res.json({ message: "OldPassword must be required", status: 0 });
    }
    if (!newPassword) {
        return res.json({ message: "Password must be required", status: 0 });
    }
    if (!confirmPassword) {
        return res.json({ message: "Confirm password must be required", status: 0 });
    }
    if (oldPassword && confirmPassword && newPassword) {
        userSchema.findOne({ email: req.user.email })
            .then((user) => {
                if (!user) return res.json({ message: "User not valid , try again", status: 0 })
                bcrypt.compare(oldPassword, user.password)
                    .then((isMatch) => {

                        if (!isMatch) return res.json({ message: "OldPassword is wrong", status: 0 });
                        if (newPassword !== confirmPassword)
                            return res.json({
                                message: "Your password and confirmation password do not match",
                                status: 0,
                            });
                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) return res.json({ message: "Something went wrong", status: 0 });
                            bcrypt.hash(newPassword, salt, (err, hash) => {
                                if (err) return res.json({ message: "Something went wrong", status: 0 });
                                user.password = hash;
                                user
                                    .save()
                                    .then((user) => {
                                        res
                                            .json({
                                                message: "Password change successfully",
                                                user,
                                                status: 1,
                                            });
                                    })
                                    .catch(() =>
                                        res.json({ message: "Internal server error!", status: 0 })
                                    );
                            });
                        });
                    })
            })
            .catch(() =>
                res.json({ message: "Internal server error!", status: 0 })
            );
    }
};

/**
 * @route GET /user/userProfile
 * @desc  user userProfile Route
 * @access Private
 **/
exports.userProfileRoute = (req, res, next) => {
    userSchema.findOne({ email: req.user.email }).select("-password")
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            res.json({ message: "User profile details", status: 1, data: user })
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

/**
 * @route Post /user/editProfile
 * @desc  user editProfile Route
 * @access Private
 **/
exports.editProfileRoute = (req, res, next) => {
    const { mobileNo, gender, birthday, countryID, stateID, address, fullname } = req.body;
    const data = { mobileNo, gender, birthday, countryID, stateID, address, fullname }

    if (req.files.profilePic) {
        data["profilePic"] = req.files.profilePic[0].path;
    }
    var editData = (data)
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            const id = user._id;
            try {
                userSchema.findByIdAndUpdate(id, { $set: editData }, { new: true, useFindAndModify: false })
                    .then((user) => res.json({ message: " Profile updated Successfully", status: 1, data: user }))
            } catch (err) {
                res.json({ message: "Internal server error!", status: 0 })
            }
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

/**
  @route post /user/supportAndHelp
  @desc supportAndHelp Route.
  @access Private
**/
exports.supportAndHelpRoute = (req, res, next) => {
    const { email, fullname, subject, message } = req.body;

    if (!email) {
        return res.json({ message: "Email data must be required", status: 0 });
    }

    if (!fullname) {
        return res.json({ message: "Fullname must be required", status: 0 });
    }

    if (!subject) {
        return res.json({ message: "Subject must be required", status: 0 });
    }

    if (!message) {
        return res.json({ message: "Message must be required", status: 0 });
    }

    var newData = new supportAndHelpSchema({ email, fullname, subject, message });

    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            var transporter = nodemailer.createTransport({
                service: "gmail",
                secure: true,
                port: 587,
                auth: {
                    user: adminEmail,
                    pass: adminPassword,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
            var mailOptions = {
                from: email,
                to: adminEmail.trim(),
                subject: `${subject}`,
                text: `${message}`,
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return res.json({ message: "Something went wrong", status: 0 });
                newData.messageByUser = user._id
                newData.save()
                res.json({
                    message: "Message send successfully",
                    status: 1,
                });
            });
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

/**
  @route post /user/reportUrl
  @desc reportUrl Route.
  @access Private
**/
exports.reportUrlRoute = (req, res, next) => {
    const { urlName, subject, message } = req.body;
    if (!urlName) {
        return res.json({ message: "Url must be required", status: 0 });
    }
    if (!subject) {
        return res.json({ message: "Subject must be required", status: 0 });
    }
    if (!message) {
        return res.json({ message: "Message must be required", status: 0 });
    }
    var newData = new urlReportSchema({ urlName, subject, message });
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            newData.reportByUser = user._id
            newData.save()
                .then(() => {
                    res.json({
                        message: "Report submit successfully",
                        status: 1,
                    });
                })
                .catch(() => {
                    res.json({ message: "Internal server error!", status: 0 })
                })
        })
}


/**
  @route Get /user/reportList
  @desc report List  Route.
  @access Private
**/
exports.reportList = (req, res, next) => {
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid, try again", status: 0 })
            urlReportSchema.find()
                .populate("reportByUser").
            exec(function(err, data) {
                if (err) return res.json({ message: "Internal server error!", status: 0 })
                res.json({ message: "success", status: 1, data })
            })
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

/**
 * @route POST /user/all
 * @desc  All users Route
 * @access Private
 **/
exports.allUsersRoute = async(req, res, next) => {
    let start = req.body.start;
    let limit = req.body.length;
    try {
        let totalRecords = await userSchema.countDocuments();
        if (totalRecords > 0) {
            await userSchema.find()
                .skip(start)
                .limit(limit)
                .select("-password -registerVerifyOTP -passwordOTP -__v")
                .sort({ createdAt: -1 })
                .then((users) => {
                    res.json({ message: "Success", status: 1, TotalRecords: totalRecords, data: users })
                })
                .catch(() => {
                    res.json({ message: "Internal server error!", status: 0 })
                })
        } else {
            res.json({ message: "success", status: 1, data: [], TotalRecords: 0 })
        }
    } catch (error) {
        res.json({ message: error.message, status: 1, data: [], TotalRecords: 0 })
    }
}

/**
 * @route Post /user/deleteAll
 * @desc  Delete Selected users Route
 * @access Private
 **/
exports.deleteAll = async(req, res, next) => {
    const { userIds } = req.body;
    if (!userIds) {
        return res.json({ message: "Please select user(s) to delete!", status: 0 });
    }
    if (userIds.length == 0) {
        return res.json({ message: "Please select user(s) to delete!", status: 0 });
    }

    await Promise.all(userIds.map(async userId => {
        await userSchema.findByIdAndDelete(userId, async(err, result) => {
            if (!err) {
                await analyticsDataSchema.deleteMany({ searchByUser: { _id: userId } });
                await supportAndHelpSchema.deleteMany({ messageByUser: { _id: userId } });
                await usersPackagePurchaseSchema.deleteMany({ userID: { _id: userId } })
            }
        });
    }));
    res.json({ message: "Data deleted successful", status: 1 })
}