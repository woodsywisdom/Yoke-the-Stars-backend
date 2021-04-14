const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../confix')

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

mongoose.model('User', UserSchema);


