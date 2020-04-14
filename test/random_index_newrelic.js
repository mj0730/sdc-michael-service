const getRandomNumber = (context, events, done) => {
  const min = 1;
  const max = 31000000;
  let index = Math.floor(Math.random() * (max - min) + min);

  context.vars.index = index;
  return done();
};


module.exports = {getRandomNumber};