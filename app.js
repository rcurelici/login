const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')

const PORT = process.env.PORT || 5002

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/users',{useNewUrlParser: true})
mongoose.connection.once('open', () =>{
    console.log('connected to mongodb....')
})

//EJS
app.set('views', path.join( __dirname, 'views'))
app.set('view engine', 'ejs')

app.use('public', express.static(path.join('public', __dirname)))

//bodyParser
app.use(bodyParser.urlencoded({extended: false}))

//session
app.use(session({
    secret: 'segretissimo1',
    saveUninitialized: 'true',
    resave: true
}))

//flash
app.use(flash())
//routes
const mainRoute = require('./routes/index')

//passport
require('./config/passportConfig')(passport)
app.use(passport.initialize())
app.use(passport.session())

//globals da flash
app.use( (req,res,next) =>{
    res.locals.error = req.flash('error')
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})


app.use(mainRoute)

app.listen(PORT, () =>{
    console.log('app listening on port: ' + PORT)
})