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

