//Scrapbook Model

var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

var scrapbookSchema = mongoose.Schema({
    name: String,
    parent: String,
    photos: {
        albumName: String,
        imageUrl: String,
        timestamp: String,
        location: String
    }
});

var scrapbookModel = mongoose.model("Scrapbook", scrapbookSchema);

//Model methods

// Note the line below assumes the current state of user model
// returning the database model for user
var User = require('./User');
var _ = require('lodash');
var graph = Promise.promisifyAll(require('fbgraph'));

var ats = "116850108484293"; // use "me" later when we have user_photos

exports.syncFacebook = function(email) {
    User.findOne({
        email: email
    }).then(function(user) {
        var token = _.find(user.tokens, { kind: 'facebook' });
        graph.setAccessToken(token.accessToken);
        return graph.getAsync(ats+"/albums");
    }).then(function(albums) {
        



















