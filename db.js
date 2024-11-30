const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mco1_datawarehouse', 'root', 'Sokoyo5)', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log('Connected to MySQL using Sequelize.'))
    .catch(err => console.error('Unable to connect:', err.message));

module.exports = sequelize;
