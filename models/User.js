const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registered_date: {
        type: Date,
        default: Date.now
    },
    key: {
        type: String,
        required: true
    },
    vault: [{
        type: Schema.Types.ObjectId,
        ref: 'UserVault'
    }]
});

let User = mongoose.model('User', UserSchema);
module.exports = User;