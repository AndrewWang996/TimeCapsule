//Scrapbook Model

var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

var locationSchema = mongoose.Schema({
    address: String,
    vicinity: String,
    latitude: Number,
    longitude: Number,
    place_id: String
});
exports.locationSchema = locationSchema;

/*
 var photoSchema = mongoose.Schema({
 albumName: String,
 photoName: String,
 imageUrl: String,
 timestamp: Date,
 location: locationSchema
 });
 */

var scrapbookSchema = mongoose.Schema({
    name: String, // TODO make unique constraint
    parent: String,
    location: locationSchema,
    photos: [{
        isPhoto: Boolean,
        albumName: String,
        photoName: String,
        imageUrl: String,
        timestamp: String,
        location: locationSchema
    }]
});
exports.scrapbookSchema = scrapbookSchema;
var scrapbookModel = mongoose.model("Scrapbook", scrapbookSchema);

var unifiedSchema = mongoose.Schema({
    isPhoto: Boolean,
    name: String,
    timestamp: String,
    location: locationSchema
});
exports.unifiedSchema = unifiedSchema;

//Model methods

// Note the line below assumes the current state of user model
// returning the database model for user
var User = require('./User');
var _ = require('lodash');
var graph = Promise.promisifyAll(require('fbgraph'));

var atsId = 116850108484293; // use "me" later when we have user_photos


exports.setPhotoName = function(scrapbookName, photoUrl, photoId, newPhotoName) {

    scrapbookModel.update({name: scrapbookName, 'photos.imageUrl' : photoUrl},
        { $set : { 'photos.$.photoName' : newPhotoName } })
        .then(function() {
            scrapbookModel.findOne({name: scrapbookName},
                {photos: {$elemMatch: {imageUrl:photoUrl} } })
                .then(function(scrapbook) {
                    console.log(scrapbook);
                })
        });

}

exports.setPhotoLocation = function(scrapbookName, photoName, location) {

    scrapbookModel.update({name: scrapbookName, 'photos.photoName' : photoName},
        { $set : { 'photos.$.location' : location } })
        .then(function() {
            scrapbookModel.findOne({name: scrapbookName},
                {photos: {$elemMatch: {photoName : photoName} } })
                .then(function(scrapbook) {
                    console.log(scrapbook);
                });
        });
}

exports.setScrapbookLocation = function(scrapbookName, location) {

    scrapbookModel.findOne({name: scrapbookName})
        .then(function(scrapbook) {

            return scrapbookModel.update({name : scrapbook.parent, 'photos.albumName' : scrapbookName},
                { $set : { 'photos.$.location' : location } } );
        });

    scrapbookModel.update({name: scrapbookName}, {$set: {location: location}}, function() {
        scrapbookModel.findOne({name: scrapbookName}).then(function(scrapbook) {
            console.log(scrapbook.location);
        });
    });
};

exports.getMainScrapbook = function() {
    return scrapbookModel.findOne({
        name: 'main'
    });
}

exports.getScrapbook = function(name) {
    return scrapbookModel.findOne({
        name: name
    });
};

// Note: Facebook does put a limit on the limit, so
// might not actually return all albums if there's a
// lot of albums. But it should do for now.

exports.syncFacebookWithId = function(facebookId) {
    var albumNames = []

    return User.findOne({
        _id: facebookId
    }).then(function(user) {
            // console.log("our user is:");
            // console.log(user);

            var token = _.find(user.tokens, { kind: 'facebook' });
            graph.setAccessToken(token.accessToken);
            return graph.getAsync(atsId+"/albums?fields=id,name,cover_photo{source}&limit=999");
        }).then(function(data) {
            // console.log("These are the albums we obtained: ");
            // console.log(data);
            var albums = data.data.filter(function(album) {
                return album.cover_photo !== undefined;
            });
            var obj = {name: "main"};
            obj.photos = albums.map(function(album) {
                return {
                    isPhoto: false,
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

            // console.log("hello, we are just about to finish this long promise call");
            // console.log(data);

            return Promise.map(data[1], function(album, index) {
                var obj = {name: albumNames[index], parent: "main"};
                obj.photos = album.data.map(function(photo) {

                    return {
                        isPhoto: true,
                        albumName: albumNames[index],
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

/*
 // Returns a promise when everything is done
 exports.syncFacebook = function(email) {
 var albumNames = []

 return User.findOne({
 email: email
 }).then(function(user) {
 console.log("our user is:");
 console.log(user);

 var token = _.find(user.tokens, { kind: 'facebook' });
 graph.setAccessToken(token.accessToken);
 return graph.getAsync(atsId+"/albums?fields=id,name,cover_photo{source}&limit=999");
 }).then(function(data) {
 console.log("These are the albums we obtained: ");
 console.log(data);
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

 console.log("hello, we are just about to finish this long promise call");
 console.log(data);

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
 */




















