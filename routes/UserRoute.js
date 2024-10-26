const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');


router.post('/signup', UserController.signup);
router.post('/signin', UserController.signIn);
router.post('/refresh-token',UserController. refreshToken);
router.post('/revoke-refresh-token', UserController.revokeRefreshToken);

module.exports = router;
