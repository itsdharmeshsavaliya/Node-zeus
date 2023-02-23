
var countryNameSchema = require("../model/countryNameSchema");
var stateNameSchema = require("../model/stateNameSchema");


/**
  @route GET /
  @desc testing Route.
  @access Public
**/
exports.testingRoute = (req, res, next) => {
  res.json({ message: "Index page testing api" })
}

/**
  @route GET /countryList
  @desc CountryList Route.
  @access Public
**/

exports.countryListRoute = (req, res, next) => {
  countryNameSchema.find().select("-iso3 -iso -timezones -subregion -native -currency -capital -region")
    .then((data) => {
      res.json({ message: "success", status: 1, data })
    })
    .catch(() => {
      res.json({ message: "Internal server error!", status: 0 })
    })
}

/**
  @route GET /stateList/:id
  @desc stateList Route.
  @access Public
**/

exports.stateListRoute = (req, res, next) => {
  const id = req.params.id
  stateNameSchema.find({
    country_id: id
  })
    .then((data) => {
      res.json({ message: "success", status: 1, data })
    })
    .catch(() => {
      res.json({ message: "Internal server error!", status: 0 })
    })
}






