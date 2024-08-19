const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('novel', 'root', 'root', {
  host: 'localhost',
  dialect: "mysql",
  define: {
    charset: 'utf8mb4',
  },
  dialectOptions: {
    collate: 'utf8mb4_unicode_ci'
  },
  logging: false
})

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = sequelize