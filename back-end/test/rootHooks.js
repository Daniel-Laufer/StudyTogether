var User = require('../models/user.model');

before(async () => {
  console.log('--Deleting user collection--');
  await User.deleteMany({}).catch(err => console.log(err));
  console.log('');
});
