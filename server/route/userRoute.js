const express = require('express');
const { signup, login, message } = require('../controller/user');
const { authentication } = require('../middleware/authentication')
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// authorize route, need credentials to access
router.get('/allmsg/:name', authentication,message)

module.exports = router

