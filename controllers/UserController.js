const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const UserController = {};

// signup
UserController.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// signin
UserController.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'not found email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'password not match' });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        
      },
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// refresh token
UserController.refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
  
    try {
      
      jwt.verify(refresh_token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }
  
        const payload = { user: { id: user.id , email: user.email, name: user.name} };
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  
        res.json({
          message: 'Token refreshed successfully',
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        });
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
};
module.exports = UserController;
