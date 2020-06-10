require('dotenv').config();
const User = require("../models/User");
const UserVault = require('../models/UserVault');
const jwt = require('jsonwebtoken');
const cryptoBitKey = require('../middleware/CryptoBitData');

module.exports = {
    // ***********************************************************************************************
    // ************************************* Add Entry to Vault **************************************
    // ***********************************************************************************************
    addItem: function (req, res) {
        // get key from user's account, passed as request body
        const key = req.body.userKey;

        // encrypt date before creating the model
        const newItem = new UserVault({
            account_name: cryptoBitKey.encrypt(req.body.account_name, key),
            username: cryptoBitKey.encrypt(req.body.username, key),
            password: cryptoBitKey.encrypt(req.body.password, key),
            url: cryptoBitKey.encrypt(req.body.url, key),
            note: cryptoBitKey.encrypt(req.body.note, key)
        });

        // save new item into the vaulta table database
        newItem.save()
            .then(vaultItem => {
                // then add the new item into the user account associated ID
                return User.findOneAndUpdate(
                    { _id: req.params.id }, // userID is being passed as the request parameter here
                    { $push: { vault: vaultItem._id } },
                    { new: true })
                    .populate("vault")
            })
            .then(userInfo => {
                // then send 200 status if success along with the new UserInfo
                res.status(200).json(userInfo);
            })
            .catch(err => {
                // send 400 status if error
                res.status(400).json(err);
            });
    },
    // ***********************************************************************************************
    // ********************************* Update Entry in the Vault ***********************************
    // ***********************************************************************************************
    updateItem: function (req, res) {
        // get key from user's account
        const key = req.body.userKey;

        // encrypt data before updating it into the database
        const updatedItem = {
            account_name: cryptoBitKey.encrypt(req.body.account_name, key),
            username: cryptoBitKey.encrypt(req.body.username, key),
            password: cryptoBitKey.encrypt(req.body.password, key),
            url: cryptoBitKey.encrypt(req.body.url, key),
            note: cryptoBitKey.encrypt(req.body.note, key)
        };

        // fined one with this vault-ItemID then update it
        UserVault.findOneAndUpdate({ _id: req.params.id }, updatedItem)
            .then(updatedItem => {
                // TODO: decrypt updated data before sending back to the client

                res.status(200).json(updatedItem);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }
}