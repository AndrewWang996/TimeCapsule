var graph;

var _ = require('lodash');
var Promise = require('bluebird');
var Scrapbook = require('../model/scrapbookModel');

exports.getBook = function(req, res) {
    res.redirect(req.url+"/main");
};

exports.getBookWithName = function(req, res) {
    Scrapbook.getAlbum(req.params.name)
    .then(function(album) {
        res.render("scrapbook/index", {
            title: "Time Capsule Scrapbook",
            album: album
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




