/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
    res.render('home', {
        title: 'Home'
    });
    /*
    * Note that our project variable is already being set to
    * "Time Capsule" in the Middleware of app.js
    */
};