const UserModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { full_name, email, username, password, role } = req.body;

    // 1. Validate input
    if (!full_name || !email || !username || !password) {
      return res.status(400).json({ success: false, error: 'Please provide full_name, email, username, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    // 2. Check existing user
    const emailExists = await UserModel.findByEmail(email);
    if (emailExists) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const usernameExists = await UserModel.findByUsername(username);
    if (usernameExists) {
      return res.status(400).json({ success: false, error: 'Username is already taken' });
    }

    // 3. Hash password
    const password_hash = await hashPassword(password);

    // 4. Create user
    const newUser = await UserModel.create({
      full_name,
      email,
      username,
      password_hash,
      role
    });

    // 5. Generate token
    const token = generateToken({ userId: newUser.user_id, role: newUser.role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token
      }
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // 1. Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 3. Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ success: false, error: 'Account is deactivated. Please contact support.' });
    }

    // 4. Generate token
    const token = generateToken({ userId: user.user_id, role: user.role });

    // Exclude password hash from response
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user,
        token
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
};
