var sendgrid = require('sendgrid')('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');

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

exports.email = function(req, res) {
    sendgrid.send({
        to: req.body.email.split(','),
        from: req.user.email,
        fromname: req.body.from,
        toname: req.body.to,
        subject: req.user.email + ' has sent you a postcard! :)',
        html: req.body.message
    }, function(err, json) {
        if(err) console.log(err);
        res.status(200);
        res.end('success');
    });
};
