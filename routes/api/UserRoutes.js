const router = require('express').Router();
const privateRoute = require('../../middleware/ValidateToken');
const UserController = require('../../controllers/UserController');

// @route       api/user/register
router.route("/register")
    // @desc-POST   Register new user
    .post(UserController.registerUser);

// @route       api/user/auth
router.route("/auth")
    // @desc-POST   login user
    .post(UserController.authenticateUser);

// @route           api/user/userID
router.route("/:id")
    // @desc-GET        get user info (Private Raoute)
    .get(privateRoute, UserController.getUserInfo)
    // @desc-DELETE     delete user account (Private Raoute)
    .delete(privateRoute, UserController.deleteUser);

module.exports = router;