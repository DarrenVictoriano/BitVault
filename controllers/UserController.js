require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cryptoBitKey = require('../middleware/CryptoBitKey');
const cryptoBitData = require('../middleware/CryptoBitData');

module.exports = {
    // ***********************************************************************************************
    // ************************************** Create new User ****************************************
    // ***********************************************************************************************
    registerUser: function (req, res) {
        // Get data sent by the client
        const { name, email, password } = req.body;

        // Verify all fields are filled
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Fill all required fields." });
        }

        // Check for existing user
        User.findOne({ email }).then(user => {
            if (user) {
                return res.status(400).json({ error: "User already exists." });
            }

            // Generate dek key based on users password
            const key = cryptoBitKey.generateDEK(password);

            // Create new User
            const newUser = new User({
                name,
                email,
                password,
                key
            });

            // Generate Salt and Hash to encrypt master password
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;

                // generate hash
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;

                    // set the user password to the generated hash
                    newUser.password = hash;

                    // save the newUser to the db
                    newUser.save().then(user => {
                        // generate web token
                        jwt.sign(
                            { id: user.id },
                            process.env.JWT_SECRET,
                            { expiresIn: 3600 },
                            (err, token) => {
                                if (err) throw err;

                                // send token back to client along with user info
                                res.status(200).json({
                                    token,
                                    user: {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        key: user.key
                                    }
                                })
                            }
                        )
                    }).catch(err => {
                        res.status(400).json({ error: err })
                    });
                });
            });
        })
    },
    // ***********************************************************************************************
    // ************************************* Authenticate User ***************************************
    // ***********************************************************************************************
    authenticateUser: function (req, res) {
        const { email, password } = req.body;

        // Validate data is not null
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all fields." });
        }

        // Check for existing user
        User.findOne({ email })
            .then(user => {
                // if user is null then return
                if (!user) {
                    return res.status(400).json({ error: "User does not exists." });
                }

                // Validate Password
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        // If not match then return
                        if (!isMatch) {
                            return res.status(400).json({ error: "Invalid Credentials" });
                        }

                        // If credential match then generate token and send data back
                        jwt.sign(
                            { id: user.id },
                            process.env.JWT_SECRET,
                            { expiresIn: 3600 },
                            (err, token) => {
                                if (err) throw err;

                                //include token before sending userInfo back
                                let userInfo = {
                                    "token": token,
                                    "id": user.id,
                                    "name": user.name,
                                    "email": user.email,
                                    "key": user.key
                                }
                                res.status(200).json(userInfo);
                            });
                    });
            }).catch(err => {
                res.status(400).json({ error: err })
            })
    },
    // ***********************************************************************************************
    // ****************************************** Get User *******************************************
    // ***********************************************************************************************
    getUserInfo: function (req, res) {
        User.findById(req.params.id)
            .populate("vault")      //  populate the vault array
            .select("-password")    //  don't inlude password
            .then(userInfo => {
                // decrypt data before sending back to client
                let decryptedData = {
                    "_id": userInfo._id,
                    "name": userInfo.name,
                    "email": userInfo.email,
                    "key": userInfo.key,
                    "vault": cryptoBitData.decryptVault(userInfo.vault, userInfo.key)
                }

                res.status(200).json(decryptedData);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    },
    // ***********************************************************************************************
    // **************************************** Delete User ******************************************
    // ***********************************************************************************************
    deleteUser: function (req, res) {
        User.deleteOne({ "_id": req.params.id })
            .then(user => {
                res.status(200).json(user);
            }).catch(err => {
                res.status(400).json(err);
            });
    }
}