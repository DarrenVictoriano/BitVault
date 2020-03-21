const router = require('express').Router();
const privateRoute = require('../../middleware/ValidateToken');
const UserController = require('../../controllers/UserController');

// @route       api/user/register
// @desc-POST   Register new user
router.route("/register")
    .post(UserController.registerUser);

// @route       api/user/auth
// @desc-GET    get user info
// @desc-POST   login user
router.route("/auth")
    .get(UserController.getUser)
    .post(UserController.authenticateUser);

module.exports = router;