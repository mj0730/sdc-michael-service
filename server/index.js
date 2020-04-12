require('newrelic');
const express = require('express');
const path = require('path');
// const { User, Review } = require('./db/index.js'); //mongo
const { User, Review } = require('./db/postgres.js'); //postgres
const faker = require('faker'); //for generating fake reviews
const moment = require('moment'); //for generating fake reviews
const cors = require('cors');
let app = express();
app.use(express.static(__dirname + '/../public/dist'));
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(cors()); //added for crud routes

//fake user generator //this will need to be modified to work with new databases. this url is using the old service's architecture
const fakeUser = (userName) => {
  let randomNumber = Math.floor(Math.random() * 100 + 1);
  return {
    name: userName,
    imageUrl: `https://hackreactoramazonfrontendcapstone.s3-us-west-2.amazonaws.com/${randomNumber}.jpeg`
  }
}

//CRUD routes
//Get all reviews by rental id
app.get('/api/rentals/:id', (req, res) => {
  let rentalId = req.params.id;
  let result = [];

  Review.findAll({where: {rental: rentalId}})
    .then(async (data) => {
      console.log('DATAAAAAAA: ', data.dataValues);
      for(let i = 0; i < data.length; i++) {
        let user = await User.findOne({ where: { id: data[i].userId } });
        let copy = {...data[i].dataValues, userProfile: user.dataValues};
        result.push(copy);
        console.log('COPY: ', copy)
      }
      res.json(result);
    })
    .catch(err => console.error(err));
})

//create a new fake review
app.post('/api/review', (req, res) => {
  const randomRating = () => Math.ceil(Math.random() * 5);
  let review = {
    userId: Math.floor(Math.random() * 100000 + 1),
    rental: Math.floor(Math.random() * 31000000 + 1),
    body: faker.fake("{{lorem.paragraph}}"),
    date: moment(
      new Date(+new Date() - Math.floor(Math.random() * 1000000000))
    ).format("l"),
    cleanliness: randomRating(),
    communication: randomRating(),
    value: randomRating(),
    accuracy: randomRating(),
    checkIn: randomRating(),
    location: randomRating()
  }

  Review.create(review)
    .then(res.sendStatus(201))
    .catch(err => console.error(err));
})

//create new user
app.post('/api/users', (req, res) => {
  let userName = req.body.name;
  User.create(fakeUser(userName))
    .then(data => console.log(`Inserted ${data} into database`))
    .then(res.sendStatus(200))
    .catch(err => console.error(`ERROR createing user: ${err}`));
})

//find a user by name
app.get('/api/users/:userName', (req, res) => {
  let userName = req.params.userName;
  User.findOne( {name: userName})
    .then(data => {
      console.log(`Found user: ${data.name}`);
      res.json(data.name);
    })
    .catch(err => console.error(`User not found: ${err}`))
})

//find a user by id
app.get('/api/users/id/:userId', (req, res) => {
  let userId = req.params.userId;
  User.findOne( {where: {id: userId}} )
    .then(data => res.json(data))
    .catch(err => console.error(err));
})

//get all reviews by username
app.get('/api/users/reviews/:userName', (req, res) => {
  let userName = req.params.userName;
  User.findOne( {name: userName })
    .then(data => Review.findAll( {where: {userId: data.id}}))
    .then(data => res.json(data));
})

//update a user image. currently uses random image from lorem picsum
app.put('/api/users', (req, res) => {
  let q = {name: req.body.name};
  User.updateOne(q, { $set: { imageUrl: 'https://picsum.photos/80'}})
    .then(console.log(`Document updated`))
    .then(res.sendStatus(200))
    .catch(err => console.error(`ERROR updating ${q}: ${err}`))
})

//delete all reviews for a property
app.delete('/api/rentals/:id', (req, res) => {
  Review.deleteMany({ rental: req.params.id })
    .then(console.log(`Reviews for record ${req.params.id} deleted`))
    .then(res.sendStatus(204))
    .catch(err => console.error(`ERROR: ${err}`));
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, console.log(`Service server listening on ${port}`));