var graph;

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

var scrapbookModel = require('../model/scrapbookModel');

/**
 * GET /maps
 * maps page to display the footsteps map given your scrapbook
 */
exports.getIndex = function(req, res) {

    var globalStorage = {};

    getScrapbooks('main', globalStorage)
        .then(function() {
            // console.log(globalStorage);
            var stringRep = JSON.stringify(globalStorage);
            res.render('maps/index', {
                title: 'Time Capsule Maps',
                scrapbooks: globalStorage
            });
        });
}


hasEnoughInformation = function(object) {
    return true;
    return object['isPhoto'] !== undefined
       && object['name'] !== undefined
       && object['timestamp'] !== undefined
       && object['location'] !== undefined;
}

getScrapbooks = function(name, globalStorage) {

    globalStorage[name] = {};
    return scrapbookModel.getScrapbook(name)
        .then(function(scrapbook) {

            var promises = [];

            scrapbook.photos.forEach(function(subScrapbook) {
                if( subScrapbook.isPhoto ) {

                    var photoObject = {
                        isPhoto: true,
                        name: subScrapbook.photoName,
                        timestamp: subScrapbook.timestamp,
                        location: subScrapbook.location
                    }

                    if( hasEnoughInformation(photoObject) ) {
                        globalStorage[name][subScrapbook.photoName] = photoObject;
                    }
                }
                else {

                    var scrapbookObject = {
                        isPhoto: false,
                        name: subScrapbook.albumName,
                        timestamp: subScrapbook.timestamp,
                        location: subScrapbook.location
                    }

                    if( hasEnoughInformation(scrapbookObject) ) {
                        globalStorage[name][subScrapbook.albumName] = scrapbookObject;
                    }

                    promises.push(
                        getScrapbooks(subScrapbook.albumName, globalStorage)
                    );
                }
            });

            return Promise.all(promises);
        });
}

/*
 exports.getIndex = function(req, res) {
 graph = require('fbgraph');

 var token = _.find(req.user.tokens, { kind: 'facebook' });
 graph.setAccessToken(token.accessToken);
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
 res.render('maps/index', {
 title: 'Time Capsule Maps',
 me: results.getMe,
 friends: results.getMyFriends
 });
 });
 }
    */