const { User, School, Sppg } = require('../models');
const { Op } = require('sequelize');

class AuthRepository {
    async findByUsernameOrEmail(username, email) {
        return await User.findOne({
            where: {
                [Op.or]: [
                    { username }, 
                    { email }
                ]
            }
        });
    }

    async findByUsernameWithPassword(username) {
        return await User.findOne({
            where: { 
                username 
            },
            attributes: { 
                include: [
                    'password'
                ] 
            }
        });
    }

    async createUser(userData, transaction = null) {
        return await User.create(
            userData, { 
                transaction 
            }
        );
    }

    async createSchool(schoolData, transaction = null) {
        return await School.create(
            schoolData, { 
                transaction 
            }
        );
    }

    async createSppg(sppgData, transaction = null) {
        return await Sppg.create(
            sppgData, { 
                transaction 
            }
        );
    }
}

module.exports = new AuthRepository();
