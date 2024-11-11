const { Sequelize } = require('sequelize');

const sequelize = new Sequelize ('postgres', 'postgres', '1', {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log
  });

// Bağlantıyı doğrulamak için:
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();

module.exports = sequelize;




 