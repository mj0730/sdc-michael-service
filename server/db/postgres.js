//const {Client} = require('pg');
const Sequelize = require('sequelize');
const aws = {
  host: '',
  dialect: 'postgres',
  port: '5432'
}

const local = {
  host: 'localhost',
  dialect: 'postgres',
  port: '5433'
}


const db = new Sequelize('airbnb', 'postgres', 'root', aws);

const User = db.define('users', {
  name: Sequelize.TEXT,
  imageUrl: Sequelize.TEXT,
  },
  {
    timestamps: false
  }
);

const Review = db.define('reviews', {
  userId: Sequelize.INTEGER,
  rental: Sequelize.INTEGER,
  body: Sequelize.TEXT,
  date: Sequelize.DATE,
  cleanliness: Sequelize.INTEGER,
  communication: Sequelize.INTEGER,
  value: Sequelize.INTEGER,
  accuracy: Sequelize.INTEGER,
  checkIn: Sequelize.INTEGER,
  location: Sequelize.INTEGER
  },
  {
    timestamps: false
  }
)

db.sync();

//to test the connection
db.authenticate()
  .then(() => console.log('Database Connected'))
  .catch(() => console.log('Error connecting to database'));

module.exports = db;
module.exports.User = User;
module.exports.Review = Review;