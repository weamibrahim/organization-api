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
      creator_id: req.user.id,
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


// Update Organization
OrganizationController.updateOrganization = async (req, res) => {
  const { name, description } = req.body;

  try {
    const organization = await Organization.findById(req.params.organization_id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const isMember = organization.members.some(member => member.email === req.user.email);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: not a member of the organization' });
    }

    const member = organization.members.find(member => member.email === req.user.email);
    
    if (member.access_level !== 'admin') {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
   const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.organization_id,
      { name, description },
      { new: true }
    )
    res.json({
      organization_id: updatedOrganization._id,
      name: updatedOrganization.name,
      description: updatedOrganization.description,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Organization
OrganizationController.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.organization_id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const isMember = organization.members.some(member => member.email === req.user.email);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: not a member of the organization' });
    }

    const member = organization.members.find(member => member.email === req.user.email);
    
    if (member.access_level !== 'admin') {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    await Organization.findByIdAndDelete(req.params.organization_id);
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Invite User to Organization
OrganizationController.inviteUserToOrganization = async (req, res) => {
  const { user_email } = req.body;
   console.log(user_email)
  try {
    const organization = await Organization.findById(req.params.organization_id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    if (organization.members.some(member => member.email === user_email)) {
      return res.status(400).json({ message: 'User already in the organization' });
    }

    organization.members.push({ email: user_email, access_level: 'read-only ' });

    await organization.save();

    res.json({ message: `User with email ${user_email} invited successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = OrganizationController;
