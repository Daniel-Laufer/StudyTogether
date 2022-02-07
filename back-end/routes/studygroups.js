var express = require('express');
var router = express.Router();
let StudygroupModel = require('../models/studygroup.model');
var helperUser = require('../helpers/helperUser');
const { body, validationResult } = require('express-validator');

/* get all study groups*/
router.get('/', helperUser.verifyToken, (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'Invalid JWT token' });
    return;
  }
  StudygroupModel.find()
    .then(studygroups => res.status(200).json(studygroups))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* get an individual study group by ID*/
router.get('/:id', function (req, res) {
  if (!req.user) {
    res.status(403).send({ message: 'Invalid JWT token' });
    return;
  }
  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => res.status(200).json(studygroup))
    .catch(err => res.status(400).json('Error: Invalid study group id'));
});

/* catching a post request with url ./create */
router.post(
  '/create',
  /* Parameter Validation */
  body('title').notEmpty(),
  body('time').notEmpty(),
  body('phone').notEmpty(),
  body('imageUrl').notEmpty(),
  body('maxAttendees').notEmpty(),
  body('hostFirstName').notEmpty(),
  body('hostLastName').notEmpty(),
  body('description').notEmpty(),
  body('tags').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    /* study group creation logic  */
    let studygroup = new StudygroupModel({
      title: req.body.title,
      time: req.body.time,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      curAttendees: req.body.curAttendees,
      maxAttendees: req.body.maxAttendees,
      hostFirstName: req.body.hostFirstName,
      hostLastName: req.body.hostLastName,
      description: req.body.description,
      tags: req.body.tags,
    });

    studygroup
      .save()
      .then(() => res.status(200).json('Study group created successfully!'))
      .catch(err => res.status(400).json('Error: ' + err));
  }
);

/* editing a study group by id */
router.patch('/edit/:id', (req, res) => {
  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => {
      Object.assign(studygroup, req.body);
      studygroup.save();
      res.status(200).json('Study group edited successfully!');
    })
    .catch(err => res.status(400).json('Error: Invalid study group id'));
});

/* deleting a study group by id */
router.delete('/delete/:id', (req, res) => {
  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => {
      studygroup.delete();
      res.status(200).json('Study group deleted successfully!');
    })
    .catch(err => res.status(400).json('Error: Invalid study group id'));
});

module.exports = router;
