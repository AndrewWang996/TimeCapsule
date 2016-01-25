var graph;

var _ = require('lodash');
var Promise = require('bluebird');
var scrapbookModel = require('../model/scrapbookModel');


exports.setPhotoName = function(req, res) {
    var scrapbookName = req.params.name;
    var photoName = req.params.photoName;

    var photoUrl = req.body.url;
    var photoId = req.body._id;

    /*
    console.log(req.body);
    console.log('setting photo name');
    console.log('scrapbook name = ' + scrapbookName);
    console.log('photo name = ' + photoName);
    console.log('photo url = ' + photoUrl);
    console.log('photo id = ' + photoId);
    */

    scrapbookModel.setPhotoName(scrapbookName, photoUrl, photoId, photoName);

    res.redirect('back');
    // res.end("finish setting photo name");
}

exports.setPhotoLocation = function(req, res) {
    var scrapbookName = req.params.name;
    var photoName = req.params.photoName;

    var location = {
        address: req.body.address,
        vicinity: req.body.vicinity,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        place_id: req.body.place_id
    };

    scrapbookModel.setPhotoLocation(scrapbookName, photoName, location);

    res.redirect('back');
    // res.end("finish setting photo location");
}

exports.setScrapbookLocation = function(req, res) {

    var scrapbookName = req.params.name;

    var location = {
        address: req.body.address,
        vicinity: req.body.vicinity,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        place_id: req.body.place_id
    };

    scrapbookModel.setScrapbookLocation(scrapbookName, location);

    res.redirect('back');
    // res.end("finish setting scrapbook location");
};


exports.getBook = function(req, res) {
    // console.log("BASDFHGJKL");
    res.redirect(req.url+"/main");
};

// TESTING
/*var picasa = require('picasa');
var Picasa = new picasa();
*/

exports.getBookWithName = function(req, res) {
/*
    console.log(_.find(req.user.tokens, {kind: "google"}));
    var token = _.find(req.user.tokens, {kind: "google"});
console.log(token.accessToken);
console.log(req.user.google);
    Picasa.getPhotos(token.accessToken, {}, function(err, photos) {
        console.log(err);
        console.log("DONE PHOTOS!");
        console.log(photos);
    });
*/

    //CALL THIS WHEN YOU NEED TO SYNC
    if(false)  {
        scrapbookModel.syncFacebookWithId(req.user._id).then(function() {
            console.log("synced with " + req.user._id);
            console.log("DONE!");
        });
    }

    /*
    Scrapbook.syncFacebook(req.user.email).then(function() {
        console.log("synced with " + req.user.email);
        console.log("DONE!");
    });
    */
    ///////////////////////////////////////

    scrapbookModel.getScrapbook(decodeURIComponent(req.params.name))
        .then(function(scrapbook) {

            res.render("scrapbook/index", {
                title: "Time Capsule Scrapbook",
                album: scrapbook
            });
        });
};


// NOT NEEDED flipping done with turn.js
/*exports.getBookWithNameAndPage = function(req, res) {

 res.render("scrapbook/index", {
 title: "Time Capsule Scrapbook",
 photos: []
 });
 };*/




// THIS METHOD IS NO LONGER BEING USED, it's for testing only
/**
 * GET /scrapbook
 * Scrapbook page, only accessible if user is logged in through facebook
 */
exports.getIndex = function(req, res) {
    graph = Promise.promisifyAll(require('fbgraph'));

    var token = _.find(req.user.tokens, { kind: 'facebook' });
    graph.setAccessToken(token.accessToken);

// We can only use public albums unless we get the user_photos permission
    var ats = "116850108484293";
    console.log(req.user.facebook);
    graph.getAsync(ats+"/albums?fields=id,name,cover_photo{source}&limit=999")
        .then(function(albums) {
//console.log(encodeURIComponent(albums.data[0].name));
            console.log(albums);
            return Promise.map(albums.data, function(album) {
                return graph.getAsync("/"+album.id+"/photos?fields=id,name,source,created_time,place&limit=999");
            });
        }).then(function(data) {




            //console.log(data);
            var photos = data;
            res.render("scrapbook/index", {
                title: "Time Capsule Scrapbook",
                photos: photos
            });
        });
};








// I commented out the original stuff on this page

/*
 async.parallel({
 getMe: function(done) {
 graph.get(req.user.facebook + "?fields=id,name,email,first_name,last_name,gender,link,locale,timezone", function(err, me) {
 done(err, me);
 });
 },
 getMyFriends: function(done) {
 graph.get(req.user.facebook + '/friends', function(err, friends) {
 done(err, friends.data);
 });
 }
 },
 function(err, results) {
 if (err) {
 return next(err);
 }
 console.log(results.getMe);

 res.render('scrapbook/index', {
 title: 'Time Capsule Scrapbook',
 me: results.getMe,
 friends: results.getMyFriends
 });
 });
 */




