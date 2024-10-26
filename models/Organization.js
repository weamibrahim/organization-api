const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      name: String,
      email: String,
      access_level: String,
    },
  ],
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
