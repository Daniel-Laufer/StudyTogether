var express = require('express');
var router = express.Router();
let user = require('../models/user.model');


/* get all users*/
router.get('/', function(req, res) {
  user.find()
  .then(user => res.status(200).json(user))
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
