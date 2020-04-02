const express = require('express');
const path = require('path');
const { User, Review } = require('./db/index.js');
const cors = require('cors');
let app = express();
app.use(express.json());
app.use(express.static(__dirname + '/../public/dist'));
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(cors()); //added for crud routes

//fake user generator
const fakeUser = (userName) => {
  let randomNumber = Math.floor(Math.random() * 100 + 1);
  return {
    name: userName,
    imageUrl: `https://hackreactoramazonfrontendcapstone.s3-us-west-2.amazonaws.com/${randomNumber}.jpeg`
  }
}

app.get('/api/rentals/:id', cors(), async (req, res) => {
  try {
    let reviews = await Review.find({ rental: req.params.id});
    let newArray = [];
    for (let i = 0; i < reviews.length; i++) {
      let user = await User.findById(reviews[i].user);
      let copy = {...reviews[i]._doc, userProfile: user};
      newArray.push(copy)
    }
   res.json(newArray)
  } catch (e) {
    res.sendStatus(500);
  }
});

app.get('/app.js', cors(), async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dist/bundle.js'))
});

//CRUD routes
//create new user
app.post('/api/users', (req, res) => {
  let userName = req.body.name;
  User.insertMany(fakeUser(userName))
    .then(data => console.log(`Inserted ${data} into database`))
    .then(res.sendStatus(200))
    .catch(err => console.log(`ERROR createing user: ${err}`));
})

//find a user by name
app.get('/api/users/:userName', (req, res) => {
  let userName = req.params.userName;
  User.findOne( {name: userName})
    .then(data => console.log(`Found user: ${data.name}`))
    .then(res.sendStatus(200))
    .catch(err => console.log(`ERROR finding user: ${err}`))
})

//update a user image. currently uses random image from lorem picsum
app.put('/api/users', (req, res) => {
  let q = {name: req.body.name};
  User.updateOne(q, { $set: { imageUrl: 'https://picsum.photos/80'}})
    .then(data => console.log(`${res.result.nModified} document updated: ${data}`))
    .then(res.sendStatus(200))
    .catch(err => console.log(`ERROR updating ${q}: ${err}`))
})

//delete all reviews for a property
app.delete('/api/rentals/:id', (req, res) => {
  Review.deleteMany({ rental: req.params.id })
    .then(console.log(`Reviews for record ${req.params.id} deleted`))
    .then(res.sendStatus(204))
    .catch(err => console.log(`ERROR: ${err}`));
})



//

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, console.log(`Service server listening on ${port}`));