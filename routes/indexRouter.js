var express = require('express');
var router = express.Router();

const {
  testingRoute,
  countryListRoute,
  stateListRoute,
} = require("../controller/indexController")



/**
  @route GET /
  @desc testing Route.
  @access Public
**/

router.get('/', testingRoute);

/**
  @route GET /countryList
  @desc countryList Route.
  @access Public
**/

router.get('/countryList', countryListRoute);

/**
  @route GET /stateList/:id
  @desc stateList Route.
  @access Public
**/

router.get('/stateList/:id', stateListRoute);




module.exports = router;
