var express = require('express');
var router = express.Router();
var { isadminLoggedIn } = require("../utility/authToken");

const {
  adminTestingRoute,
  adminLoginRoute,
  adminChangePasswordRoute
} = require("../controller/adminController");

/** 
  @route /admin 
  @desc admin Testing Route
  @access Public
**/
router.get('/', adminTestingRoute);

/**
  @route /admin/login
  @desc Admin Login Route
  @access Public
**/
router.post('/login', adminLoginRoute);

/**
* @route Post /user/changePassword
* @desc  Admin Change Password Route
* @access Public
**/
router.post('/changePassword', adminChangePasswordRoute);

module.exports = router;

