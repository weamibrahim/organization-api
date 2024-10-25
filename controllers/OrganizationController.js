const Organization = require('../models/Organization');

// Create Organization
const OrganizationController = {};

OrganizationController.createOrganization = async (req, res) => {
  const { name, description } = req.body;

  //console.log(req.user);
  //console.log(req.body)

  try {
    const organization = new Organization({
      name,
      description,
      members: [{ name: req.user.name, email: req.user.email, access_level: 'admin' }],
    });

    await organization.save();
    res.status(201).json({ organization_id: organization._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = OrganizationController;
