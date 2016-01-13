/**
 * Split into declaration and initialization for better startup performance.
 */
var graph;
var ig;

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
    res.render('api/index', {
        title: 'API Examples'
    });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = function(req, res, next) {
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
            res.render('api/facebook', {
                title: 'Facebook API',
                me: results.getMe,
                friends: results.getMyFriends
            });
        });
};

/**
 * GET /api/instagram
 * Instagram API example.
 */
exports.getInstagram = function(req, res, next) {
    ig = require('instagram-node').instagram();

    var token = _.find(req.user.tokens, { kind: 'instagram' });
    ig.use({ client_id: process.env.INSTAGRAM_ID, client_secret: process.env.INSTAGRAM_SECRET });
    ig.use({ access_token: token.accessToken });
    async.parallel({
        searchByUsername: function(done) {
            ig.user_search('richellemead', function(err, users, limit) {
                done(err, users);
            });
        },
        searchByUserId: function(done) {
            ig.user('175948269', function(err, user) {
                done(err, user);
            });
        },
        popularImages: function(done) {
            ig.media_popular(function(err, medias) {
                done(err, medias);
            });
        },
        myRecentMedia: function(done) {
            ig.user_self_media_recent(function(err, medias, pagination, limit) {
                done(err, medias);
            });
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        res.render('api/instagram', {
            title: 'Instagram API',
            usernames: results.searchByUsername,
            userById: results.searchByUserId,
            popularImages: results.popularImages,
            myRecentMedia: results.myRecentMedia
        });
    });
};