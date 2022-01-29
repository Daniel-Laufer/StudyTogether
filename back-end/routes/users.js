var express = require('express');
var router = express.Router();

/* get hardcoded user for now - to help test*/
router.get('/', function(req, res, next) {
  var user = {
    firstName:"Tobey",
    lastName:"Maguire",
    email:"Tobey.Maguire@mail.utoronto.ca",
    role:"student",
    verified: false
  }
  res.status(200).json(user);
});

module.exports = router;
