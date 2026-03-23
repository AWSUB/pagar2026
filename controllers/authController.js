const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
    async register(req, res) {
      try {
        const { username, password, role, registration_code, bgn_code } = req.body;

        const existingUser = await User.findOne({ 
          where: { 
            username 
          } 
        });

        if (existingUser) {
          return res.status(400).json({ 
            status: 'error', 
            message: 'Username is already taken.' 
          });
        }

        let initialStatus = 'APPROVED';
        if (role === 'SPPG' || role === 'SCHOOL') {
          initialStatus = 'PENDING';
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
          username,
          password: hashedPassword,
          role,
          registration_code: registration_code || null,
          bgn_code: bgn_code || null,
          account_status: initialStatus
        });

        return res.status(201).json({
          status: 'success',
          message: initialStatus === 'PENDING' 
            ? 'Registration successful. Waiting for Admin approval.'
            : 'Registration successful.',
          data: {
            id_user: newUser.id_user,
            username: newUser.username,
            role: newUser.role,
            account_status: newUser.account_status
          }
        });
      } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ 
          status: 'error', 
          message: 'Internal server error.' 
        });
      }
    },

    async login(req, res) {
      try {
        const { username, password } = req.body;

        const user = await User.findOne({ 
          where: { 
            username 
          }, 
          attributes: {
            include: ['password']
          } 
        });

        if (!user) {
          return res.status(401).json({ 
            status: 'error', 
            message: 'Invalid credentials.' 
          });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ 
            status: 'error', 
            message: 'Invalid credentials.' 
          });
        }

        if (user.account_status === 'PENDING') {
          return res.status(403).json({ 
            status: 'error', 
            message: 'Account is waiting for Admin approval.' 
          });
        }
        if (user.account_status === 'REJECTED') {
          return res.status(403).json({ 
            status: 'error', 
            message: 'Account registration was rejected.' 
          });
        }

        const payload = { id_user: user.id_user, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { 
          expiresIn: '24h' 
      });

        return res.status(200).json({
          status: 'success',
          message: 'Login successful.',
          data: { token, user: { 
            id_user: user.id_user, 
            username: user.username, 
            role: user.role 
          } 
          }
        });
      } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ 
          status: 'error', 
          message: 'Internal server error.' 
        });
      }
    }
  };

module.exports = authController;
