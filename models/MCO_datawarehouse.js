const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

// Define the game_details table
const GameDetails = sequelize.define('GameDetails', {
    game_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    game_name: { type: DataTypes.TEXT, allowNull: true },
    release_date: { type: DataTypes.DATE, allowNull: true },
    game_description: { type: DataTypes.TEXT('long'), allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: true },
    estimated_ownership: { 
        type: DataTypes.ENUM('Very Low', 'None', 'Low', 'Low Moderate', 'Moderate', 'High Moderate', '2M+', 'High'),
        allowNull: true 
    },
    esrb_rating: { 
        type: DataTypes.ENUM('E', 'M', 'AO', 'T', 'E10'), 
        allowNull: true 
    },
}, { tableName: 'game_details', timestamps: false });

module.exports = {
    GameDetails,
};
