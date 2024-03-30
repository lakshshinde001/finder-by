const express = require('express');
const { registerUser, loginUser, logout, forgotpassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');
const { getAllProducts } = require('../controllers/productControllers');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotpassword);

router.route('/resetpassword:token').put(resetPassword)
router.route('/me').get(isAuthenticatedUser,  getUserDetails);
router.route('/updatepassword').post(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUser)

router.route('/admin/user/:id').get(isAuthenticatedUser, authorizedRoles('admin'), getSingleUser)
.put(isAuthenticatedUser, authorizedRoles('admin'), updateUserRole)
.delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser);

module.exports = router;