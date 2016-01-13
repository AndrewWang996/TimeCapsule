var graph;

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

/**
 * GET /scrapbook
 * Scrapbook page, only accessible if user is logged in through facebook
 */
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
            console.log(results.getMe);

            res.render('scrapbook/index', {
                title: 'Time Capsule Scrapbook',
                me: results.getMe,
                friends: results.getMyFriends
            });
        });
}




