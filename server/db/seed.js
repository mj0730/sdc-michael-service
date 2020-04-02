const { User, Review }  = require('./index.js');
const faker = require('faker');

const users = [];
for (let i = 1; i <= 100; i++) {
  users.push({
    name: faker.name.findName(),
    imageUrl: `https://hackreactoramazonfrontendcapstone.s3-us-west-2.amazonaws.com/${i}.jpeg`
  });
}

const reviews = [];

const seedDb = function() {
  User.insertMany(users)
    .then(() => User.find())
    .then( users => {
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < 100; j++) {
          reviews.push({
            user: users[i]._id,
            rental: j + 1,
            body: faker.fake('{{lorem.paragraph}}'),
            cleanliness: Math.ceil(Math.random() * 5),
            communication: Math.ceil(Math.random() * 5),
            value: Math.ceil(Math.random() * 5),
            accuracy: Math.ceil(Math.random() * 5),
            checkIn: Math.ceil(Math.random() * 5),
            location: Math.ceil(Math.random() * 5)
          });
        }
      }
      return Review.insertMany(reviews);
    })
    .then(() => {})
    .catch((e) => console.log(e));
};

seedDb();
