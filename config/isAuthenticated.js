
module.exports = {
    ensureAuthenticated: (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('error_msg', 'please log in to view this page')
        res.redirect('/users/login')
    }
}
}