var express = require('express');
var router = express.Router();
var { isLoggedIn } = require("../utility/authToken");
var uploadImage = require("../utility/uploadImage");

const {
  userTestingRoute,
  userRegisterRoute,
  verifyOTPRoute,
  userLoginRoute,
  userForgotPasswordRoute,
  userResetPasswordRoute,
  userProfileRoute,
  editProfileRoute,
  userChangePasswordRoute,
  supportAndHelpRoute,
  reportUrlRoute,
  reportList,
  allUsersRoute,
  deleteAll
} = require("../controller/userController");

/** 
  @route /user 
  @desc user Testing Route
  @access Public
**/
router.get('/', userTestingRoute);

/** 
  @route /user/userRegister
  @desc user Register Route
  @access Public
**/
router.post('/userRegister', userRegisterRoute);

/**
  @route /user/verifyOTP
  @desc user Verify OTP Route
  @access Public
**/

router.post('/verifyOTP', verifyOTPRoute);

/**
  @route /user/userLogin
  @desc user Login Route
  @access Public
**/

router.post('/userLogin', userLoginRoute);

/**
* @route Post /user/forgotPassword
* @desc  user forgotPassword Route
* @access Public
**/

router.post('/forgotPassword', userForgotPasswordRoute);

/**
* @route Post /user/resetPassword
* @desc  user resetPassword Route
* @access Public
**/

router.post('/resetPassword', userResetPasswordRoute);

/**
* @route get /user/userProfile
* @desc  user userProfile Route
* @access Private
**/

router.get('/userProfile', isLoggedIn, userProfileRoute);

/**
* @route Post /user/editProfile
* @desc  user editProfile Route
* @access Private
**/

router.post('/editProfile', isLoggedIn, uploadImage.fields([{ name: "profilePic", maxCount: 1 }]), editProfileRoute);

/**
* @route Post /user/changePassword
* @desc  user changePassword Route
* @access Private
**/

router.post('/changePassword', isLoggedIn, userChangePasswordRoute);

/**
  @route post /user/supportAndHelp
  @desc supportAndHelp Route.
  @access Private
**/

router.post('/supportAndHelp', isLoggedIn, supportAndHelpRoute);

/**
  @route post /user/reportUrl
  @desc reportUrl Route.
  @access Private
**/

router.post('/reportUrl', isLoggedIn, reportUrlRoute);

/**
  @route Get /user/reportList
  @desc report List  Route.
  @access Private
**/
router.get('/reportList', isLoggedIn , reportList);

/**
* @route Post /user/all
* @desc  All users Route
* @access Private
**/
router.post('/all', allUsersRoute);


/**
* @route Post /user/deleteAll
* @desc  Delete Selected users Route
* @access Private
**/
router.post('/delete', deleteAll);

module.exports = router;

