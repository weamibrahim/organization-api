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

// Read Organization by ID
OrganizationController.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.organization_id);
    // Check if the organization exists
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    // Check if the user is a member
    if (!organization.members.some(member => member.email === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }
     res.json({
      organization_id: organization._id,
      name: organization.name,
      description: organization.description,
      organization_members: organization.members,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Read All Organizations
OrganizationController.getAllOrganizations = async (req, res) => {
  try {
    
    const organizations = await Organization.find();
    
    const response = organizations.map(org => ({
      organization_id: org._id,
      name: org.name,
      description: org.description,
      organization_members: org.members,
    }));

    res.json(response);
       
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = OrganizationController;
