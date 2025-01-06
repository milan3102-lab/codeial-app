module.exports.setFlash = function(req, res, next) {
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    };
    next();
};

module.exports.setCurrentUser = function(req, res, next) {
    res.locals.user = req.user || null; // Sets current user or null
    next();
};
