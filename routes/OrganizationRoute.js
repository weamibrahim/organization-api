const express = require('express');
const  OrganizationController = require('../controllers/OrganizationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, OrganizationController.createOrganization);
router.get('/:organization_id', authMiddleware,OrganizationController. getOrganizationById);
router.get('/', authMiddleware,OrganizationController. getAllOrganizations);

module.exports = router;
