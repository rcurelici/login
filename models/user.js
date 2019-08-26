const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

userSchema.methods.hashAndSave = function(password){
    const user = this
    const SALT_ROUNDS =  11
    bcrypt.genSalt(SALT_ROUNDS, (err, salt)=>{
        bcrypt.hash(password, salt, (err, hashedPassword) =>{
            if(err){
                console.log(err)
            }
            console.log('password hashed' + hashedPassword)
            user.password = hashedPassword
            user.save()
        })
    })
}
userSchema.methods.checkPassword = function(password, cb){
    const user = this 
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err){
            console.log(err)
        }
        cb(isMatch)
    })
}


userSchema.post('save', (user, next)=>{
    console.log('new user saved: ' + user.email)
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User