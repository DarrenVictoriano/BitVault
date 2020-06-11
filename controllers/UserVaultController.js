require('dotenv').config();
const User = require("../models/User");
const UserVault = require('../models/UserVault');
const jwt = require('jsonwebtoken');
const cryptoBitData = require('../middleware/CryptoBitData');

module.exports = {
    // ***********************************************************************************************
    // ************************************* Add Item to Vault ***************************************
    // ***********************************************************************************************
    addItem: function (req, res) {
        // get key from user's account, passed as request body
        const key = req.body.userKey;

        // encrypt date before creating the model
        const newItem = new UserVault({
            account_name: cryptoBitData.encrypt(req.body.account_name, key),
            username: cryptoBitData.encrypt(req.body.username, key),
            password: cryptoBitData.encrypt(req.body.password, key),
            url: cryptoBitData.encrypt(req.body.url, key),
            note: cryptoBitData.encrypt(req.body.note, key)
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
    // ********************************* Update Item in the Vault ************************************
    // ***********************************************************************************************
    updateItem: function (req, res) {
        // get key from user's account
        const key = req.body.userKey;

        // encrypt data before updating it into the database
        const updatedItem = {
            account_name: cryptoBitData.encrypt(req.body.account_name, key),
            username: cryptoBitData.encrypt(req.body.username, key),
            password: cryptoBitData.encrypt(req.body.password, key),
            url: cryptoBitData.encrypt(req.body.url, key),
            note: cryptoBitData.encrypt(req.body.note, key)
        };

        // fined one with this vault-ItemID then update it
        UserVault.findOneAndUpdate({ _id: req.params.id }, updatedItem, { new: true })
            .then(updatedItem => {
                // decrypt updated data before sending back to the client
                let decryptItem = {
                    "_id": updatedItem._id,
                    "account_name": cryptoBitData.decrypt(updatedItem.account_name, key),
                    "username": cryptoBitData.decrypt(updatedItem.username, key),
                    "password": cryptoBitData.decrypt(updatedItem.password, key),
                    "url": cryptoBitData.decrypt(updatedItem.url, key),
                    "note": cryptoBitData.decrypt(updatedItem.note, key)
                }
                res.status(200).json(decryptItem);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    },
    // ***********************************************************************************************
    // ********************************* Delete Item in the Vault ************************************
    // ***********************************************************************************************
    deleteItem: function (req, res) {
        UserVault.deleteOne({ "_id": req.params.id })
            .then(deletedItem => {
                res.status(200).json(deletedItem);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }
}