const express = require('express');
const {signup, login, alluser, message} = require('../controller/user');
const {authentication} = require('../middleware/authentication')
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login)
router.get('/messages', message)
router.get('/alluser', authentication,alluser)

module.exports = router

