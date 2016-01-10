//User Model

var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

var userModel = mongoose.model("User", userSchema);

// Model methods
// NOTE these methods return promises

// Note: Do you guys want model create user to check if username exists?
// Or do that separately (current state)
// NOTE: method returns a promise use .then to do stuff after it
exports.create = function(username, password) {
    return userModel.create({
        username: username,
        password: password
    });
}

exports.verify(username, password) {
    return userModel.findOne({
        username: username
    }).then(function(user) {
        if(user.password != password) {
            throw 'password mismatch';
        } else {
            return 'success';
        }
    });
}













