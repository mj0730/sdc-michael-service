const { User, Review }  = require('./index.js');
const faker = require('faker');
const path = require('path');
const fs = require('fs');

const IMG_PATH = path.join(__dirname, '../../__mocks__/scrapedimages');
const IMG_URL = 'https://hrr44fec.s3.us-east-2.amazonaws.com/';

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

//read the files names in the image directory
const imgFileNames = fs.readdirSync(IMG_PATH, (err, files) => {
  if (err) {
    throw new Error(console.log("couldn't read the files"));
  } else {
    return files;
  }
});

//get random image and return its file name
const createRandomPhoto = (images) => {
  return images[getRandomNumber(0, 1036)];
};

//create users
const users = [];

for (let i = 1; i <= 100; i++) {
  users.push({
    name: faker.name.findName(),
    imageUrl: createRandomPhoto(imgFileNames)
  });
}

//create reviews
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
    .catch((e) => console.log(e));
};

for (let i = 0; i < 10; i++) {
  seedDb();
}
process.exit(0)