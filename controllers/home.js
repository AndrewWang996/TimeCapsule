/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
    res.render('home', {
        title: "Time Capsule"
    });
};