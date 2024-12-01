const { DataTypes } = require('sequelize');
const {centralNode, node2, node3} = require('../db'); 

const defineGameDetailsModel = (sequelizeInstance) => {
    return sequelizeInstance.define('GameDetails', {
        game_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        game_name: { type: DataTypes.TEXT, allowNull: true },
        release_date: { type: DataTypes.DATE, allowNull: true },
        game_description: { type: DataTypes.TEXT('long'), allowNull: true },
        price: { type: DataTypes.FLOAT, allowNull: true },
        estimated_ownership: {
            type: DataTypes.ENUM('Very Low', 'None', 'Low', 'Low Moderate', 'Moderate', 'High Moderate', '2M+', 'High'),
            allowNull: true,
        },
        esrb_rating: {
            type: DataTypes.ENUM('E', 'M', 'AO', 'T', 'E10'),
            allowNull: true,
        },
    }, {
        tableName: 'game_details',
        timestamps: false,
    });
};

const GameDetails1 = defineGameDetailsModel(centralNode);
const GameDetails2 = defineGameDetailsModel(node2);
const GameDetails3 = defineGameDetailsModel(node3);

module.exports = {
    GameDetails1,
    GameDetails2,
    GameDetails3
};
