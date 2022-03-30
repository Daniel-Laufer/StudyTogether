var express = require('express');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var router = express.Router();
let group = require('../models/studygroup.model');
let user = require('../models/user.model');
let Token = require('../models/token.model');
let report = require('../models/reports.model');
const { body, validationResult } = require('express-validator');
const helperUser = require('../helpers/helperUser');

router.post(
  '/createreport/:id',
  helperUser.verifyToken,
  body('description').notEmpty(),
  body('type').notEmpty(),
  async (req, res) => {
    if (!req.user) {
      res.status(401).send({ message: 'Invalid JWT token' });
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      console.log(errors);
      return;
    }
    var accused;
    if (req.body.type == 'User') {
      accused = await user.findById(req.params.id);
    } else if (req.body.type == 'Group') {
      accused = await group.findById(req.params.id);
    }
    console.log(req.params.id);
    console.log(accused);
    new report({
      reporterId: req.user.id,
      accusedId: accused.id,
      description: req.body.description,
      reportType: req.body.type,
    })
      .save()
      .catch(err => res.status(400).json('Error: ' + err))
      .then(() => {
        res.status(200).send('Report generated');
      });
  }
);

module.exports = router;
