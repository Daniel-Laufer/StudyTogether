var express = require('express');
var router = express.Router();
let StudygroupModel = require('../models/studygroup.model');
var helperUser = require('../helpers/helperUser');
const { body, validationResult } = require('express-validator');

/* get all study groups*/
router.get('/', helperUser.verifyToken, (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }
  StudygroupModel.find()
    .then(studygroups => res.status(200).json(studygroups))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* get an individual study group by ID*/
router.get('/:id', helperUser.verifyToken, (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
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
  helperUser.verifyToken,
  /* Parameter Validation */
  body('title').notEmpty(),
  body('startDateTime').notEmpty(),
  body('endDateTime').notEmpty(),
  body('phone').notEmpty(),
  body('imageUrl').notEmpty(),
  body('location').exists().bail().isObject().bail().notEmpty(),
  body('maxAttendees').notEmpty(),
  body('tags').exists().bail().isArray().bail().notEmpty(),
  (req, res) => {
    // checking if user is authenticated
    if (!req.user) {
      res.status(401).send({ message: 'Invalid JWT token' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    /* study group creation logic  */
    let studygroup = new StudygroupModel({
      title: req.body.title,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      curAttendees: req.body.curAttendees,
      location: req.body.location,
      maxAttendees: req.body.maxAttendees,
      hostId: req.user.id,
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
router.patch('/edit/:id', helperUser.verifyToken, async (req, res) => {
  // check whether the user is authenticated as the host of this study group
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }

  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => {
      if (studygroup.hostId != req.user.id) {
        res.status(403).send({ message: 'Not study group creator' });
        return;
      }

      var isDelayed =
        (req.body.startDateTime ?? studygroup.startDateTime) >
        studygroup.startDateTime;
      Object.assign(studygroup, { ...req.body, ...{ delayed: isDelayed } });
      studygroup
        .save()
        .then(res => res.status(200).json('Study group edited successfully!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: Invalid study group id'));
});

/* deleting a study group by id */
router.delete('/delete/:id', helperUser.verifyToken, (req, res) => {
  // check whether the user is authenticated as the host of this study group
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }

  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => {
      if (studygroup.hostId != req.user.id) {
        res.status(403).send({ message: 'Not study group creator' });
        return;
      }
      studygroup.delete();
      res.status(200).json('Study group deleted successfully!');
    })
    .catch(err => res.status(400).json('Error: Invalid study group id'));
});

/* Canceling a room marks it as inactive then deletes it after a grace period. The grace period allows the host to undo deleting a room. */
router.patch('/cancel/:id', helperUser.verifyToken, (req, res) => {
  // check whether the user is authenticated as the host of this study group
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }

  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => {
      if (studygroup.hostId != req.user.id) {
        res.status(403).send({ message: 'Permission denied' });
        return;
      }

      /* TODO after we implement notification => Notify users (pub sub) */
      //...

      Object.assign(studygroup, { ...req.body, canceled: true });

      /* TODO: create a grace token where a room deletes after a fixed time from cancelation unless undone (a different subtask)*/
      studygroup
        .update(
          { id: req.user.id },
          {
            expireAt: 1000, //10 seconds
          }
        )
        .then(res => res.status(200).json('Study group edited successfully!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
