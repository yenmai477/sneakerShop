const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getHome);

router.get('/users/resetPassword/:token', viewController.getResetPasswordLink);

module.exports = router;
