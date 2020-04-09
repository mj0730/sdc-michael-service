const faker = require("faker");
const fs = require("fs");
const path = require('path');
const moment = require("moment");

//constants used for number of generated items
const numOfFakeUsers = 100000;
const numOfFakeReviews = 20000000;
const numOfProperties = 10000000;

//getting image file names
const IMG_PATH = path.join(__dirname, '../../__mocks__/scrapedimages');

const imgFileNames = fs.readdirSync(IMG_PATH, (err, files) => {
  if (err) {
    throw new Error(console.log("couldn't read the files"));
  } else {
    return files;
  }
});
////////////

//get random image and return its file name
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const createRandomPhoto = (images) => {
  return images[getRandomNumber(0, 1036)];
};
/////////

//Generate user table csv
const writeUsers = fs.createWriteStream("randomUsers.csv");
writeUsers.write(
  "name,imageUrl\n",
  "utf8"
);

function writeFakeUsers(writer, encoding, callback) {
  let i = numOfFakeUsers;

  function write() {
    let ok = true;
    do {
      i--;
      const name = faker.name.findName();
      const imageUrl = createRandomPhoto(imgFileNames);
      const data = `${name},${imageUrl}\n`;

      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once("drain", write);
    }
  }
  write();
}

writeFakeUsers(writeUsers, "utf-8", () => {
  writeUsers.end();
});

//generate reviews table csv
const writeReviews = fs.createWriteStream("randomReviews.csv");
// writeReviews.write(
//   "userId,rental,body,date,cleanliness,communication,value,accuracy,checkIn,location\n",
//   "utf8"
// );

function writeFakeReviews(writer, encoding, callback) {
  let i = numOfFakeReviews;

  function write() {
    let ok = true;
    do {
      i--;
      let userId = getRandomNumber(1, numOfFakeUsers);
      let rental = getRandomNumber(1, numOfProperties);
      const body = faker.fake("{{lorem.paragraph}}");
      var date = moment(
        new Date(+new Date() - Math.floor(Math.random() * 1000000000) )
        ).format("l");
      const cleanliness = Math.ceil(Math.random() * 5);
      const communication = Math.ceil(Math.random() * 5);
      const value = Math.ceil(Math.random() * 5);
      const accuracy = Math.ceil(Math.random() * 5);
      const checkIn = Math.ceil(Math.random() * 5);
      const location = Math.ceil(Math.random() * 5);
      const data = `${userId},${rental},${body},${date},${cleanliness},${communication},${value},${accuracy},${checkIn},${location}\n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once("drain", write);
    }
  }
  write();
}

writeFakeReviews(writeReviews, "utf-8", () => {
  writeReviews.end();
});