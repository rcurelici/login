const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport =require('passport')
const isAuthenticated = require('../config/isAuthenticated').ensureAuthenticated

router.get('/login', (req, res, next) =>{
    res.render('login')
})
router.get('/logout', (req, res, next) =>{
    req.logout()
    req.flash('success_msg', 'user logged out please log in again')
    res.redirect('/users/login')
})

router.get('/signup', (req, res, next) =>{
    res.render('signup')
})

router.get('/dashboard',  isAuthenticated,(req, res, next) =>{
    res.render('dashboard')
})
router.post('/signup', (req,res, next)=>{
    const { username, email, password, confirmPassword } = req.body
    const errors = []
    //input validation
    if(!username || !email || !password || !confirmPassword){
        errors.push({message: 'Please fill all fields'})
    }
    if(password !== confirmPassword){
        errors.push({message: 'Confirm password must be the same'})
    }
    if(errors.length > 0){
        res.render('signup', {errors, username, email, password, confirmPassword})
    }else{
        User.findOne({email: email}, (err, user)=>{
            if(err){
                console.log(err)
                return
            }
            if(user){
                errors.push({message:'email already exists'})
            }else{
                const newUser = new User({username, email, password})
                newUser.hashAndSave(password)
                console.log(newUser)
            }
        })
        req.flash('success_msg', 'new user registered, you can now log in') 
        res.redirect('/users/login')
    }

})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}))


module.exports = router