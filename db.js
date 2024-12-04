const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.local' });

// { path: '.env.local' }

// ADD THIS LINE INSIDE .config();
// const sequelize = new Sequelize('mco1_datawarehouse', 'root', '0614loveSSHSmeow!', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

const centralNode = new Sequelize('mco1_datawarehouse', process.env.DB1_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB1_PORT,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

if(centralNode){
    console.log('Central Node Connected! ');
}

const node2 = new Sequelize('mco1_datawarehouse', process.env.DB2_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB2_PORT,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

if(centralNode){
    console.log('Node 2 Connected! ');
}

// node3 here
const node3 = new Sequelize('mco1_datawarehouse', process.env.DB3_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB3_PORT,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

if(centralNode){
    console.log('Node 3 Connected! ');
}

Promise.all([
    centralNode.authenticate().then(() => console.log('Connected to Central Node')),
    node2.authenticate().then(() => console.log('Connected to Node 2')),
    node3.authenticate().then(() => console.log('Connected to Node 3')),
]).catch(err => console.error('Error connecting to nodes:', err.message));

// sequelize.authenticate()
//     .then(() => console.log('Connected to MySQL using Sequelize.'))
//     .catch(err => console.error('Unable to connect:', err.message));

module.exports = { centralNode, node2, node3 };
