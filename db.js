const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('mco1_datawarehouse', 'root', '0614loveSSHSmeow!', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

const centralNode = new Sequelize('mco1_datawarehouse', 'node1', 'rootpass', {
    host: 'ccscloud.dlsu.edu.ph',
    dialect: 'mysql',
    port: 20842
});

const node2 = new Sequelize('mco1_datawarehouse', 'node2', 'rootpass', {
    host: 'ccscloud.dlsu.edu.ph',
    dialect: 'mysql',
    port: 20852
});

// node3 here
const node3 = new Sequelize('mco1_datawarehouse', 'node3', 'rootpass', {
    host: 'ccscloud.dlsu.edu.ph',
    dialect: 'mysql',
    port: 20862
});

Promise.all([
    centralNode.authenticate().then(() => console.log('Connected to Central Node')),
    node2.authenticate().then(() => console.log('Connected to Node 2')),
    node3.authenticate().then(() => console.log('Connected to Node 3')),
]).catch(err => console.error('Error connecting to nodes:', err.message));

// sequelize.authenticate()
//     .then(() => console.log('Connected to MySQL using Sequelize.'))
//     .catch(err => console.error('Unable to connect:', err.message));

module.exports = { centralNode, node2, node3 };
