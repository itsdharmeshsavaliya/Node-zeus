var express = require('express');
var router = express.Router();
var { isLoggedIn } = require("../utility/authToken");

const {
    testingRoute,
    listRoute,
    purchaseRoute,
    purchaseHistoryRoute,
    totalBoltRoute
} = require("../controller/packageController");

/**
  @route GET /package
  @desc package testing Route.
  @access Private
**/
router.get('/', isLoggedIn, testingRoute);

/**
  @route GET /package/list
  @desc Package List Route.
  @access Private
**/
router.get('/list', isLoggedIn, listRoute);

/**
  @route POST /package/purchase
  @desc Package purchase Route.
  @access Private
**/
router.post('/purchase', isLoggedIn, purchaseRoute);

/**
  @route POST /package/purchase_history
  @desc Package purchase history of user Route.
  @access Private
**/
router.post('/purchase/history', isLoggedIn, purchaseHistoryRoute);

/**
  @route POST /package/total_bolt
  @desc Total Bolt of user Route.
  @access Private
**/
router.post('/total_bolt', isLoggedIn, totalBoltRoute);

module.exports = router;
