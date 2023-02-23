var userSchema = require("../model/userSchema");
var packageSchema = require("../model/packageSchema");
var usersPackagePurchaseSchema = require("../model/usersPackagePurchaseSchema");

exports.testingRoute = (req, res, next) => {
    res.json({ message: "Package testing api" })
}

exports.listRoute = (req, res, next) => {
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid, try again!", status: 0 })

            packageSchema.find()
                .then((data) => {
                    res.json({ message: "success", status: 1, data })
                })
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

async function getPackageByID(PackageID) {
    return await new Promise(async(resolve, reject) => {
        await packageSchema.findOne({ _id: PackageID }).exec(async(err, packageData) => {
            if (err) { return reject({}); }
            resolve(packageData);
        });
    });
}

exports.purchaseRoute = async(req, res, next) => {
    var user = await userSchema.findOne({ email: req.user.email })
    if (!user) return res.json({ message: "User not valid, try again!", status: 0 })

    let { packageID, transactionID } = req.body;
    if (!packageID) return res.json({ message: "Please select package!", status: 0 });
    if (!transactionID) return res.json({ message: "Enter transaction ID!", status: 0 });

    var packageData = await getPackageByID(packageID);
    if (packageData) {
        var objPurchase = {
            userID: req.user._id,
            packageID: packageData._id,
            transactionID
        };
        const userPackagePurchaseData = new usersPackagePurchaseSchema(objPurchase);
        await userPackagePurchaseData.save(async function(err, data) {
            if (err) return res.json({ message: "Internal server error!", status: 0, err })

            var userTotalBolt = (user.totalBolt) ? parseInt(user.totalBolt) : 0;
            userTotalBolt = parseInt(userTotalBolt) + parseInt(packageData.lbe);
            userTotalBolt = userTotalBolt + parseInt(packageData.cw);
            user.totalBolt = userTotalBolt;
            await user.save();

            res.json({ message: "Package purchased successful", status: 1, data })
        });
    } else {
        res.json({ message: "Please select package!", status: 0 })
    }
}

exports.purchaseHistoryRoute = async(req, res, next) => {
    var user = await userSchema.findOne({ email: req.user.email });
    if (!user) return res.json({ message: "User not valid, try again!", status: 0 })

    try {
        var data = await usersPackagePurchaseSchema.find({ userID: req.user._id }).populate('packageID');
        res.json({ message: "Success", status: 1, data })
    } catch (err) {
        res.json({ message: "Internal server error!", status: 0, err })
    }
}

exports.totalBoltRoute = async(req, res, next) => {
    var user = await userSchema.findOne({ email: req.user.email });
    if (!user) return res.json({ message: "User not valid, try again!", status: 0 })
    var userTotalBolt = (user.totalBolt) ? parseInt(user.totalBolt) : 0;
    res.json({ message: "Success", status: 1, data: { userTotalBolt } })
}