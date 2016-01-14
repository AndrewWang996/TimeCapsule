var graph;

var _ = require('lodash');
var Promise = require('bluebird');

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
    graph.getAsync(ats+"/albums")
    .then(function(albums) {
        return Promise.map(albums.data, function(album) {
            return graph.getAsync("/"+album.id+"/photos");
        });
    }).then(function(data) {  
        return Promise.map(data[0].data, function(photo) {
            return graph.getAsync("/"+photo.id+"?fields=id,name,picture,source");
        });
    }).then(function(data) {




        console.log(data);
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




