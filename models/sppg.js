'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sppg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sppg.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user'
      });

      Sppg.hasMany(models.DailyReport, {
        foreignKey: 'id_sppg',
        as: 'dailyReports'
      });

      Sppg.hasMany(models.Review, {
        foreignKey: 'id_sppg',
        as: 'reviews'
      });
    }
  }
  Sppg.init({
    id_sppg: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sppg_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sppg_address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Sppg',
    tableName: 'sppg',
    freezeTableName: true
  });
  return Sppg;
};