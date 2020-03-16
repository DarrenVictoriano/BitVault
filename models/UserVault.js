const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const UserVaultSchema = new Schema({
    account_name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    }
});

let UserVault = mongoose.model("UserVault", UserVaultSchema);
module.exports = UserVault;