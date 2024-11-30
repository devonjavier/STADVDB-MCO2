const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 


const DimDevelopers = sequelize.define('DimDevelopers', {
    developer_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    developer_name: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'Dim_developers', timestamps: false });


const DimPublishers = sequelize.define('DimPublishers', {
    publisher_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    publisher_name: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'Dim_publishers', timestamps: false });


const DimPlaytimeDetails = sequelize.define('DimPlaytimeDetails', {
    playtime_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    game_overall_average_playtime: { type: DataTypes.INTEGER, allowNull: true },
    game_overall_median_playtime: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'Dim_playtime_details', timestamps: false });


const DimDetails = sequelize.define('DimDetails', {
    details_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    game_name: { type: DataTypes.TEXT, allowNull: false },
    release_date: { type: DataTypes.STRING(45), allowNull: true },
    game_description: { type: DataTypes.TEXT('long'), allowNull: true },
    website: { type: DataTypes.STRING(255), allowNull: true },
    support_url: { type: DataTypes.TEXT, allowNull: true },
    support_email: { type: DataTypes.STRING(255), allowNull: true },
    peakCCU: { type: DataTypes.INTEGER, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: true },
    game_dlc_count: { type: DataTypes.INTEGER, allowNull: true },
    recommendation_count: { type: DataTypes.INTEGER, allowNull: true },
    achievement_count: { type: DataTypes.INTEGER, allowNull: true },
    estimated_ownership: { type: DataTypes.ENUM('Very Low', 'None', 'Low', 'Low Moderate', 'Moderate', 'High Moderate', '2M+', 'High'), allowNull: true },
    esrb_rating: { type: DataTypes.ENUM('E', 'M', 'AO', 'T', 'E10'), allowNull: true },
}, { tableName: 'Dim_details', timestamps: false });


const DimSupport = sequelize.define('DimSupport', {
    support_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    windows_support: { type: DataTypes.ENUM('True', 'False'), allowNull: false },
    mac_support: { type: DataTypes.ENUM('True', 'False'), allowNull: false },
    linux_support: { type: DataTypes.ENUM('True', 'False'), allowNull: false },
}, { tableName: 'Dim_support', timestamps: false });


const DimLanguages = sequelize.define('DimLanguages', {
    language_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    interface_supported_language: { type: DataTypes.TEXT, allowNull: true },
    audio_supported_language: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Dim_languages', timestamps: false });

const DimReviews = sequelize.define('DimReviews', {
    review_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reviews: { type: DataTypes.TEXT, allowNull: true },
    positive_review_count: { type: DataTypes.INTEGER, allowNull: true },
    negative_review_count: { type: DataTypes.INTEGER, allowNull: true },
    metacritic_score: { type: DataTypes.FLOAT, allowNull: true },
    metacritic_url: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Dim_reviews', timestamps: false });


const DimMediaUrl = sequelize.define('DimMediaUrl', {
    media_url_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    screenshots_url: { type: DataTypes.TEXT, allowNull: true },
    movie_url: { type: DataTypes.TEXT, allowNull: true },
    header_image_url: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Dim_media_url', timestamps: false });

const DimAttributes = sequelize.define('DimAttributes', {
    attributes_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categories: { type: DataTypes.STRING(500), allowNull: true },
    genres: { type: DataTypes.STRING(500), allowNull: true },
    tags: { type: DataTypes.STRING(500), allowNull: true },
}, { tableName: 'Dim_attributes', timestamps: false });


const Fact_Game = sequelize.define('FactGame', {
    game_no: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    game_ID: { type: DataTypes.INTEGER, allowNull: false },
    developer_ID: { type: DataTypes.INTEGER, allowNull: true },
    publisher_ID: { type: DataTypes.INTEGER, allowNull: true },
    playtime_ID: { type: DataTypes.INTEGER, allowNull: true },
    details_ID: { type: DataTypes.INTEGER, allowNull: true },
    support_ID: { type: DataTypes.INTEGER, allowNull: true },
    language_ID: { type: DataTypes.INTEGER, allowNull: true },
    review_ID: { type: DataTypes.INTEGER, allowNull: true },
    media_url_ID: { type: DataTypes.INTEGER, allowNull: true },
    attributes_ID: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'Fact_Game', timestamps: false });

Fact_Game.belongsTo(DimDevelopers, { foreignKey: 'developer_ID', as: 'developer' });
Fact_Game.belongsTo(DimPublishers, { foreignKey: 'publisher_ID', as: 'publisher' });
Fact_Game.belongsTo(DimPlaytimeDetails, { foreignKey: 'playtime_ID', as: 'playtimeDetails' });
Fact_Game.belongsTo(DimDetails, { foreignKey: 'details_ID', as: 'details' });
Fact_Game.belongsTo(DimSupport, { foreignKey: 'support_ID', as: 'support' });
Fact_Game.belongsTo(DimLanguages, { foreignKey: 'language_ID', as: 'language' });
Fact_Game.belongsTo(DimReviews, { foreignKey: 'review_ID', as: 'review' });
Fact_Game.belongsTo(DimMediaUrl, { foreignKey: 'media_url_ID', as: 'mediaUrl' });
Fact_Game.belongsTo(DimAttributes, { foreignKey: 'attributes_ID', as: 'attributes' });


module.exports = {
    DimDevelopers,
    DimPublishers,
    DimPlaytimeDetails,
    DimDetails,
    DimSupport,
    DimLanguages,
    DimReviews,
    DimMediaUrl,
    DimAttributes,
    Fact_Game,
};
