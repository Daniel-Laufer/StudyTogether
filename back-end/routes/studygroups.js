var express = require('express');
var router = express.Router();
let StudygroupModel = require('../models/studygroup.model');

/* get all study groups*/
router.get('/', function (req, res) {
  StudygroupModel.find()
    .then(studygroups => res.status(200).json(studygroups))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* get an individual study group by ID*/
router.get('/:id', function (req, res) {
  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => res.status(200).json(studygroup))
    .catch(err => res.status(400).json('Error: Invalid study group id'));
});

module.exports = router;
