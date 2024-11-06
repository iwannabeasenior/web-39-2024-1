const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM('CUSTOMER','ADMIN'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "gmail"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "gmail",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "gmail" },
        ]
      },
    ]
  });
};
