/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/login', {
        title: 'Login'
    });
};


/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.account = function(req, res) {
    // LIST OF THEMES
    req.session.theme = req.session.theme || 'Leather'; //default
    console.log(req.session.theme);
    var themes = ['Leather', 'Ice', 'Paris'];
    res.render('account/account', {
        title: "Settings",
        themes: themes,
        curTheme: req.session.theme
    });
};

exports.setTheme = function(req, res) {
    req.session.theme = req.body.theme;
    //console.log(req.session.theme);
    res.status(200);
    res.end('success');
};
