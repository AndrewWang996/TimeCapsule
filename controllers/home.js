/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
    console.log(">>>>>>>>>> res local user for home page >>>>>>>");
    console.log(res.locals.user);
    console.log(">>>>>>>>>> res local user for home page >>>>>>>");

    res.render('home', {
        title: "Time Capsule"
    });
};