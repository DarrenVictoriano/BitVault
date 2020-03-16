require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

            // Create new User
            const newUser = new User({
                name,
                email,
                password
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
                                        email: user.email
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
        User.findOne({ email }).then(user => {
            // if user is null then return
            if (!user) {
                return res.status(400).json({ error: "User does not exists." });
            }

            // Validate Password
            bcrypt.compare(password, user.password).then(isMatch => {
                // If not match then return
                if (!isMatch) {
                    return res.status(400).json({ error: "Invalid Credentials" });
                }

                // If credential match then generate token and send data back
                jwt.sign({ id: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;

                        res.status(200).json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        });
                    });
            });
        }).catch(err => {
            res.status(400).json({ error: err })
        })
    },
    // ***********************************************************************************************
    // ****************************************** Get User *******************************************
    // ***********************************************************************************************
    getUser: function (req, res) {
        User.findById(req.body.id).select("-password")
            .then(user => {
                res.status(200).json(user);
            }).catch(err => {
                res.status(400).json(err)
            });
    }
}