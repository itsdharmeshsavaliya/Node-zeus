var express = require('express');
var router = express.Router();
var { isLoggedIn } = require("../utility/authToken");

const {
    testingRoute,
    createDataRoute,
    fetchDataRoute,
    fetchDataByUserIDRoute,
    fetchAllDataRoute,
    checkKeywordRoute,
    deleteUserSearchDataRoute,
    deleteAll
} = require("../controller/analyticsDataController");

/**
  @route GET /analyticsData
  @desc analyticsData testing Route.
  @access Private
**/
router.get('/', isLoggedIn, testingRoute);

/**
  @route POST /analyticsData/checkKeyword
  @desc checkKeyword Route.
  @access Private
**/
router.post('/checkKeyword', isLoggedIn, checkKeywordRoute);


/**
  @route POST /analyticsData/createData
  @desc createData Data Route.
  @access Private
**/
router.post('/createData', isLoggedIn, createDataRoute);


/**
  @route GET /analyticsData/fetchData
  @desc fetchData Route.
  @access Private
**/
router.get('/fetchData', isLoggedIn, fetchDataRoute);

/**
  @route GET /analyticsData/fetchDataUserID
  @desc fetchDataByUserID Route.
  @access Private
**/
router.get('/fetchDataUserID', isLoggedIn, fetchDataByUserIDRoute);

/**
  @route GET /analyticsData/all
  @desc all analyticsData admin Route.
  @access Private
**/
router.post('/all', fetchAllDataRoute);

/**
  @route post /analyticsData/deleteUserSearchData
  @desc deleteUserSearchData Route.
  @access Private
**/
router.delete('/deleteUserSearchData', isLoggedIn, deleteUserSearchDataRoute);

/**
 * @route Post /analyticsData/deleteAll
 * @desc  Delete Selected analyticsData Route
 * @access Private
 **/
router.post('/delete', deleteAll);

module.exports = router;