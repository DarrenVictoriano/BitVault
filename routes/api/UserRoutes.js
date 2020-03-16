const router = require('express').Router();
const privateRoute = require('../../middleware/ValidateToken');
const UserController = require('../../controllers/UserController');

// @route   api/user/register
router.route("/register")
    .post(UserController.registerUser);

// @route   api/user/auth
router.route("/auth")
    .get(UserController.getUser)
    .post(UserController.authenticateUser);

module.exports = router;