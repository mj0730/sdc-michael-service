const express = require('express');
const path = require('path');
// const { User, Review } = require('./db/index.js'); //mongo
const { User, Review } = require('./db/postgres.js'); //postgres
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

//OLD CODE, CAN DELETE ONCE NEW CODE IS TESTED
// app.get('/api/rentals/:id', cors(), async (req, res) => {
//   try {
//     let reviews = await Review.find({ rental: req.params.id});
//     let newArray = [];
//     for (let i = 0; i < reviews.length; i++) {
//       let user = await User.findById(reviews[i].user);
//       let copy = {...reviews[i]._doc, userProfile: user};
//       newArray.push(copy)
//     }
//    res.json(newArray)
//   } catch (e) {
//     res.sendStatus(500);
//   }
// });

app.get('/app.js', cors(), async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dist/bundle.js'))
});

//CRUD routes
//Get all reviews by rental id
app.get('/api/rentals/:id', (req, res) => {
  let rentalId = req.params.id;
  Review.findAll({where: {rental: rentalId}})
    .then(data => res.json(data))
    .catch(err => console.error(err));
})

//create new user
app.post('/api/users', (req, res) => {
  let userName = req.body.name;
  User.insertMany(fakeUser(userName))
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



//

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, console.log(`Service server listening on ${port}`));