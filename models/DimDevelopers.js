const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Your Sequelize instance

const DimDevelopers = sequelize.define('DimDevelopers', {
    developer_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    developer_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'Dim_developers', // Maps to the database table
    timestamps: false, // Disable Sequelize's automatic timestamp columns
});

module.exports = DimDevelopers;