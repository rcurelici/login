const LocalStrategy = require('passport-local').Strategy
//user model
const User = require('../models/user')

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },(email, password, done)=>{
        User.findOne({email: email}, (err, user) => {
            if(err){
                return done(err)
            }
            if(!user){
                return done(null, false, { message: 'Incorrrect email'})
            }
            user.checkPassword(password, (isMatch) => {
                if(!isMatch){
                    return done(null, false, {message: 'Incorrect password'})
                }else{
                    return done(null, user)
                }
            })
        })
    }))
    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id, (err, user) =>{
            done(err, user)
        })
    })
}