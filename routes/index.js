const express = require('express')
const usersRoute = require('./users')

const router = express.Router()

router.get('/', (req,res,next)=>{
    res.render('index')
})

router.use('/users', usersRoute)
module.exports = router