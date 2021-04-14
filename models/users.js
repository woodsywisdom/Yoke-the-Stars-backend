const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config/keys').secret;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: [ /^[a-zA-Z0-9]+$/, 'username contains invalid characters'],
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [ /\S+@\S+\.\S+/, 'not a valid email' ],
        index: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, {message: 'This username or email is already being used'});

UserSchema.methods.setPassword = function(pw) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(pw, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(pw) {
    const hash = crypto.pbkdf2Sync(pw, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
};


mongoose.model('User', UserSchema);


