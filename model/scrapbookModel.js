//Scrapbook Model

var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

var scrapbookSchema = mongoose.Schema({
    name: String, // TODO make unique constraint
    parent: String,
    photos: [{
        albumName: String,
        photoName: String,
        imageUrl: String,
        timestamp: String,
        location: String
    }]
});

var scrapbookModel = mongoose.model("Scrapbook", scrapbookSchema);

//Model methods

// Note the line below assumes the current state of user model
// returning the database model for user
var User = require('./User');
var _ = require('lodash');
var graph = Promise.promisifyAll(require('fbgraph'));

var ats = "116850108484293"; // use "me" later when we have user_photos

// Note: Facebook does put a limit on the limit, so
// might not actually return all albums if there's a
// lot of albums. But it should do for now.

// Returns a promise when everything is done
exports.syncFacebook = function(email) {
    var albumNames = []

    return User.findOne({
        email: email
    }).then(function(user) {
        var token = _.find(user.tokens, { kind: 'facebook' });
        graph.setAccessToken(token.accessToken);
        return graph.getAsync(ats+"/albums?fields=id,name,cover_photo{source}&limit=999");
    }).then(function(data) {
        var albums = data.data.filter(function(album) {
            return album.cover_photo !== undefined;
        });
        var obj = {name: "main"};
        obj.photos = albums.map(function(album) {
            return {
                albumName: album.name,
                imageUrl: album.cover_photo.source
            };
        });     

        var dbPromise = scrapbookModel.findOneAndUpdate({name: "main"}, obj, {upsert: true});
        var fbPromise = Promise.map(albums, function(album) {
            albumNames.push(album.name);
            return graph.getAsync("/"+album.id+"/photos?fields=id,name,source,created_time,place&limit=999");
        });

        return Promise.all([dbPromise, fbPromise]);
    }).then(function(data) {
        return Promise.map(data[1], function(album, index) {
            var obj = {name: albumNames[index], parent: "main"};
            obj.photos = album.data.map(function(photo) {
                return {
                    photoName: photo.name,
                    imageUrl: photo.source,
                    timestamp: photo.created_time,
                    location: photo.place
                };
            });
            return scrapbookModel.findOneAndUpdate({name: albumNames[index]}, obj, {upsert: true});
        });
    });
};

exports.getAlbum = function(name) {
    return scrapbookModel.findOne({
        name: name
    });
};


















