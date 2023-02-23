var analyticsDataSchema = require("../model/analyticsDataSchema");
var searchDataSchema = require("../model/searchDataSchema");
var userSchema = require("../model/userSchema");

/**
  @route GET /analyticsData
  @desc analyticsData testing Route.
  @access Private
**/
exports.testingRoute = (req, res, next) => {
    res.json({ message: "AnalyticsData testing api" })
}

/**
  @route POST /analyticsData/checkKeyword
  @desc checkKeyword Route.
  @access Private
**/
exports.checkKeywordRoute = (req, res, next) => {
    let { searchKeyword } = req.body;

    if (!searchKeyword) {
        return res.json({ message: "SearchKeyword must be required", status: 0 });
    }
    searchKeyword = searchKeyword.toLowerCase();
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid, try again", status: 0 })
            analyticsDataSchema.findOne({ searchKeyword })
                .then((findKeyWord) => {
                    if (findKeyWord) {
                        searchDataSchema.findOne({ searchKeyword, searchByUser: user._id })
                            .then((isMatch) => {
                                if (!isMatch) {
                                    var newSearchData = new searchDataSchema({ searchKeyword, searchByUser: user._id, searchAnalyticsData: findKeyWord._id })
                                    newSearchData.save()
                                }
                            })
                        res.json({
                            message: "success",
                            status: 1,
                            data: {
                                isApiData: false,
                                data: findKeyWord
                            }
                        })
                    } else {
                        res.json({
                            message: "success",
                            status: 1,
                            data: {
                                isApiData: true,
                            }
                        })
                    }
                })
                .catch(() => {
                    res.json({ message: "Internal server error!", status: 0 })
                })

        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

/**
  @route POST /analyticsData/createData
  @desc createData Route.
  @access Private
**/
exports.createDataRoute = (req, res, next) => {
    let { analyticsData, searchKeywordType, searchKeyword, checkedStarted, checkedEnd, durationBetweenTime } = req.body;

    if (!analyticsData) {
        return res.json({ message: "Analytics data must be required", status: 0 });
    }

    if (!searchKeywordType) {
        return res.json({ message: "SearchKeywordType must be required", status: 0 });
    }
    if (searchKeywordType != "Email Verify API" &&
        searchKeywordType != "Domain Reputation API" &&
        searchKeywordType != "URL Reputation API" &&
        searchKeywordType != "I.P Reputation API") {
        return res.json({ message: "Invalid SearchKeywordType", status: 0 });
    }

    if (!searchKeyword) {
        return res.json({ message: "SearchKeyword must be required", status: 0 });
    }

    if (!checkedStarted) {
        return res.json({ message: "checkedStarted must be required", status: 0 });
    }

    if (!checkedEnd) {
        return res.json({ message: "checkedEnd must be required", status: 0 });
    }

    if (!durationBetweenTime) {
        return res.json({ message: "durationBetweenTime must be required", status: 0 });
    }

    //START check sufficient bolt
    var userTotalBolt = (user.totalBolt) ? user.totalBolt : 0;
    userTotalBolt = parseInt(userTotalBolt);
    if (userTotalBolt <= 0) {
        return res.json({ message: "You don't have sufficient boltning point(s), please purchase bolt package!", status: 0 });
    }
    //END

    searchKeyword = searchKeyword.toLowerCase();
    var newData = new analyticsDataSchema({ analyticsData, searchKeywordType, searchKeyword, checkedStarted, checkedEnd, durationBetweenTime });
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            analyticsDataSchema.findOne({ searchKeyword })
                .then((findKeyWord) => {
                    if (findKeyWord) return res.json({ message: "SearchKeyword already exists", status: 0 })
                    var newSearchData = new searchDataSchema({ searchKeyword, searchByUser: user._id, searchAnalyticsData: newData._id })
                    newSearchData.save()
                        .then(() => {
                            newData.save()
                                .then((find) => {

                                    //START when user search any keyword, than decrease 1 bolt from user's total bolts.
                                    if (userTotalBolt > 0) {
                                        user.totalBolt = userTotalBolt - 1;
                                        user.save();
                                    }
                                    //END

                                    res.json({
                                        message: "success",
                                        status: 1,
                                        data: {
                                            data: find
                                        }
                                    })
                                })
                                .catch(() => {
                                    res.json({ message: "Internal server error!", status: 0 })
                                })
                        })
                })
                .catch(() => {
                    res.json({ message: "Internal server error!", status: 0 })
                })
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

/**
  @route GET /analyticsData/fetchData
  @desc fetchData Route.
  @access Private
**/
exports.fetchDataRoute = (req, res, next) => {
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            analyticsDataSchema.find()
                .then((data) => {
                    res.json({ message: "success", status: 1, data })
                })
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

/**
  @route GET /analyticsData/fetchDataUserID
  @desc fetchDataByUserID Route.
  @access Private
**/
exports.fetchDataByUserIDRoute = (req, res, next) => {
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            searchDataSchema.find({ searchByUser: user._id }).
            populate('searchAnalyticsData').
            exec(function(err, data) {
                if (err) return res.json({ message: "Internal server error!", status: 0 })
                res.json({ message: "success", status: 1, data })
            })
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}

async function getSearchHistoryByAnalyticID(analyticsDataID) {
    return await new Promise(async(resolve, reject) => {
        await searchDataSchema.find({ searchAnalyticsData: analyticsDataID }).populate('searchByUser').exec(async(err, allSearchHistory) => {
            if (err) { return reject([]); }

            let allUsers = await Promise.all(allSearchHistory.map(async SearchHistoryData => {
                let user = SearchHistoryData.searchByUser;
                if (user) {
                    return {
                        searchKeyword: SearchHistoryData.searchKeyword,
                        user_id: user._id,
                        user_email: user.email,
                        searchAnalyticsData: SearchHistoryData.searchKeyword,
                        createdAt: SearchHistoryData.createdAt,
                        updatedAt: SearchHistoryData.updatedAt
                    };
                }
            }));
            resolve(allUsers);
        });
    });
}

function convertObjectToArray(obj) {
    if (obj === null || obj === undefined) return;
    if (Array.isArray(obj)) return obj;
    return Object.keys(obj).map(key => ({ name: key, newObject: convertObjectToArray(obj[key]) }));
}

function arrayConvert(json) {
    var arr = [];
    for (index in json) {
        var obj = json[index];
        var key = null;
        while (typeof obj == 'object') {
            for (ind in obj) {
                if (key == null) key = ind;
                obj = obj[ind];
            }
        }
        arr.push({ 'key': key, 'val': obj });
    }
    return arr;
}
exports.fetchAllDataRoute = async(req, res, next) => {
    let start = req.body.start;
    let limit = req.body.length;
    try {
        let totalRecords = await analyticsDataSchema.countDocuments();
        if (totalRecords > 0) {
            await analyticsDataSchema.find()
                .skip(start)
                .limit(limit)
                .sort({ createdAt: -1 }).exec(async(err, allAnalyticsData) => {
                    if (err) return res.json({ message: "Internal server error!", status: 0 })

                    if (allAnalyticsData) {
                        let list = await Promise.all(allAnalyticsData.map(async analyticsData => {
                            analyticsData.allUsers = await getSearchHistoryByAnalyticID(analyticsData._id);
                            //let newAnalyticsData = (needArray) ? convertObjectToArray(analyticsData) : analyticsData;
                            //let newAnalyticsData = (needArray) ? arrayConvert(analyticsData) : analyticsData;
                            //return newAnalyticsData;
                            return analyticsData;
                        }));
                        res.json({ message: "success", status: 1, TotalRecords: totalRecords, data: list })
                    } else {
                        res.json({ message: "success", status: 1, data: [] })
                    }
                })
        } else {
            res.json({ message: "success", status: 1, data: [], TotalRecords: 0 })
        }
    } catch (error) {
        res.json({ message: error.message, status: 1, data: [], TotalRecords: 0 })
    }
}


/**
 * @route Post /analyticsData/deleteAll
 * @desc  Delete Selected analyticsData Route
 * @access Private
 **/
exports.deleteAll = async(req, res, next) => {
    const { analyticsIds } = req.body;
    if (!analyticsIds) {
        return res.json({ message: "Please select record(s) to delete!", status: 0 });
    }
    if (analyticsIds.length == 0) {
        return res.json({ message: "Please select record(s) to delete!", status: 0 });
    }

    await Promise.all(analyticsIds.map(async analyticsId => {
        await analyticsDataSchema.findById(analyticsId, async(error, analyticsData) => {
            if (!error) {
                if (analyticsData) {
                    await analyticsDataSchema.findByIdAndDelete(analyticsData._id, async(err, result) => {
                        if (!err) {
                            await searchDataSchema.deleteMany({ searchKeyword: analyticsData.searchKeyword })
                        }
                    });
                }
            }
        })
    }));
    res.json({ message: "Data deleted successful", status: 1 })
}

/**
  @route Delete /analyticsData/deleteUserSearchData
  @desc deleteUserSearchData Route.
  @access Private
**/
exports.deleteUserSearchDataRoute = (req, res, next) => {
    let { searchKeyword } = req.body;

    if (!searchKeyword) {
        return res.json({ message: "searchKeyword must be required", status: 0 });
    }
    searchKeyword = searchKeyword.toLowerCase();
    userSchema.findOne({ email: req.user.email })
        .then((user) => {
            if (!user) return res.json({ message: "User not valid , try again", status: 0 })
            searchDataSchema.findOneAndDelete({ searchByUser: user._id, searchKeyword })
                .then(() => {
                    res.json({ message: "Deleted successfully", status: 1 })
                })
                .catch(() => {
                    res.json({ message: "Internal server error!", status: 0 })
                })
        })
        .catch(() => {
            res.json({ message: "Internal server error!", status: 0 })
        })
}