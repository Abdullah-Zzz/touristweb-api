const express = require("express")
const router = express.Router()
const {addComment,getComments} = require("../controllers/commentController")
const {chkTokenExists, verifyToken} = require('../middleware/authMiddleware')

router.post('/:id', chkTokenExists, verifyToken, addComment)
router.get('/:id', getComments)

module.exports = router