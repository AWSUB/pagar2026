const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, School, Sppg, sequelize } = require('../models');
const { Op } = require('sequelize');

const authController = {
    async registerPublic(req, res) {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({ 
                where: { [Op.or]: [
                  { username }, 
                  { email }
                ] } 
            });

            if (existingUser) {
                return res.status(400).json({ status: 'error', message: 'Username or Email is already taken.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'PUBLIC',
                account_status: 'APPROVED'
            });

            return res.status(201).json({
                status: 'success',
                message: 'Public registration successful.',
                data: { 
                  id_user: newUser.id_user, 
                  username: newUser.username, 
                  role: newUser.role 
                }
            });
        } catch (error) {
            console.error('Register Public Error:', error);
            return res.status(500).json({ 
              status: 'error', 
              message: 'Internal server error.' 
            });
        }
    },

    async registerSchool(req, res) {
        const t = await sequelize.transaction();
        try {
            const { username, email, password, school_name, school_address, registration_code } = req.body;

            if (!school_name || !school_address) {
                await t.rollback();
                return res.status(400).json({ 
                  status: 'error', 
                  message: 'School name and address are required.' 
                });
            }

            const existingUser = await User.findOne({ 
                where: { [Op.or]: [
                  { username }, 
                  { email }
                ] } 
            });

            if (existingUser) {
                await t.rollback();
                return res.status(400).json({ 
                  status: 'error', 
                  message: 'Username or Email is already taken.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'SCHOOL',
                registration_code: registration_code || null,
                account_status: 'PENDING'
            }, { transaction: t });

            await School.create({
                id_user: newUser.id_user,
                school_name,
                school_address
            }, { transaction: t });

            await t.commit();

            return res.status(201).json({
                status: 'success',
                message: 'School registration successful. Waiting for Admin approval.',
                data: { 
                  id_user: newUser.id_user, 
                  username: newUser.username, 
                  role: newUser.role 
                }
            });
        } catch (error) {
            await t.rollback();
            console.error('Register School Error:', error);
            return res.status(500).json({ 
              status: 'error', 
              message: 'Internal server error.' 
            });
        }
    },

    async registerSppg(req, res) {
        const t = await sequelize.transaction();
        try {
            const { username, email, password, sppg_name, sppg_address, bgn_code } = req.body;

            if (!sppg_name || !sppg_address) {
                await t.rollback();
                return res.status(400).json({ 
                  status: 'error', 
                  message: 'SPPG name and address are required.' 
                });
            }

            const existingUser = await User.findOne({ 
                where: { [Op.or]: [
                  { username }, 
                  { email }
                ] } 
            });

            if (existingUser) {
                await t.rollback();
                return res.status(400).json({ 
                  status: 'error', 
                  message: 'Username or Email is already taken.' 
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'SPPG',
                bgn_code: bgn_code || null,
                account_status: 'PENDING'
            }, { transaction: t });

            await Sppg.create({
                id_user: newUser.id_user,
                sppg_name,
                sppg_address
            }, { transaction: t });

            await t.commit();

            return res.status(201).json({
                status: 'success',
                message: 'SPPG registration successful. Waiting for Admin approval.',
                data: { 
                  id_user: newUser.id_user, 
                  username: newUser.username, 
                  role: newUser.role 
                }
            });
        } catch (error) {
            await t.rollback();
            console.error('Register SPPG Error:', error);
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

        const payload = { 
          id_user: user.id_user, 
          role: user.role 
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { 
          expiresIn: '24h' 
      });

        return res.status(200).json({
          status: 'success',
          message: 'Login successful.',
          data: { token, 
            user: { 
              id_user: user.id_user, 
              username: user.username, 
              email: user.email,
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
