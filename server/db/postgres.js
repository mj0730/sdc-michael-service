//const {Client} = require('pg');
const Sequelize = require('sequelize');

const db = new Sequelize('airbnb', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres'
});

const User = db.define('users', {
  name: Sequelize.TEXT,
  imageUrl: Sequelize.TEXT,
});

const Review = db.define('reviews', {
  rental: Sequelize.INTEGER,
  body: Sequelize.TEXT,
  date: Sequelize.DATE,
  cleanliness: Sequelize.INTEGER,
  communication: Sequelize.INTEGER,
  value: Sequelize.INTEGER,
  accuracy: Sequelize.INTEGER,
  checkIn: Sequelize.INTEGER,
  location: Sequelize.INTEGER
})

User.belongsTo(Review);

db.sync();

//to test the connection
db.authenticate()
  .then(() => console.log('Database Connected'))
  .catch(() => console.log('Error connecting to database'));

module.exports = db;
module.exports.User = User;
module.exports.Review = Review;