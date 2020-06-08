const router = require('express').Router();
const privateRoute = require('../../middleware/ValidateToken');
const UserController = require('../../controllers/UserController');

// @route       api/user/register
// @desc-POST   Register new user
router.route("/register")
    .post(UserController.registerUser);

// @route       api/user/auth
// @desc-POST   login user
router.route("/auth")
    .post(UserController.authenticateUser);

// @route       api/user/auth/userID
// @desc-GET    get user info
router.route("/auth/:id")
    .get(UserController.getUser)
    .delete(UserController.deleteUser);


module.exports = router;