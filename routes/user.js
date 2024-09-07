const express=require('express')
const {getUser, loginUser, registerUser, logout, routeLogin, sendEmail, resetPass,protectRouteResetPass} = require("../controllers/userControllers")
const {chkTokenExists, verifyToken} = require("../middleware/authMiddleware")
const router = express.Router()

router.post('/login', loginUser)

router.post('/register', registerUser)

router.get('/api/user' , chkTokenExists, verifyToken, getUser)

router.get('/logout', chkTokenExists, verifyToken, logout)

router.get('/login', chkTokenExists, verifyToken, routeLogin)

router.post('/resetpass', sendEmail)

router.post('/:id/:token', resetPass)

router.get('/:id/:token',protectRouteResetPass )


module.exports = router;
