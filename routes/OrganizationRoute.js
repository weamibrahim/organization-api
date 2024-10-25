const express = require('express');
const  OrganizationController = require('../controllers/OrganizationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, OrganizationController.createOrganization);


module.exports = router;
