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
  var studygroup = await StudygroupModel.findById(groupId).catch(err =>
    res.status(400).json('Error: ' + err)
  );
  if (studygroup.hostId != req.user.id) {
    res.status(403).send({ message: 'Permission denied!' });
    return;
  }
  var isDelayed =
    (new Date(req.body.startDateTime).getTime() ??
      new Date(studygroup.startDateTime).getTime()) >
    new Date(studygroup.startDateTime).getTime();

  console.log(isDelayed);
  if (isDelayed)
    Object.assign(studygroup, { ...req.body, ...{ delayed: isDelayed } });
  else Object.assign(studygroup, req.body);

  await studygroup.save().catch(err => res.status(400).json('Error: ' + err));
  res.status(200).json('Study group edited successfully!');
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
router.put('/cancel/:id', helperUser.verifyToken, async (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }
  const groupId = req.params.id;
  var studygroup = await StudygroupModel.findById(groupId).catch(err => {
    res.status(400).json('Error: ' + err);
    return;
  });

  if (studygroup.hostId != req.user.id) {
    res.status(403).send({ message: 'Not study group creator' });
    return;
  }
  /* begin https://stackoverflow.com/questions/7687884/add-10-seconds-to-a-date */
  var t = new Date();
  t.setHours(t.getHours() + 1); // 1 hour grace peroid grace period
  /* end */
  var updatedStudygroup = await StudygroupModel.findByIdAndUpdate(groupId, {
    canceledAt: t,
  }).catch(err => {
    res.status(400).json('Error: ' + err);
    return;
  });

  res.status(200).json(updatedStudygroup);
});

/* undo canceling in case the user decides otherwise */
router.put('/reactivate/:id', helperUser.verifyToken, async (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }
  const groupId = req.params.id;
  var studygroup = await StudygroupModel.findById(groupId).catch(err => {
    res.status(400).json('Error: ' + err);
    return;
  });

  if (studygroup.hostId != req.user.id) {
    res.status(403).send({ message: 'Not study group creator' });
    return;
  }
  var updatedStudygroup = await StudygroupModel.findByIdAndUpdate(groupId, {
    $unset: { canceledAt: 1 },
  }).catch(err => res.status(400).json('Error: ' + err));

  res.status(200).json(updatedStudygroup);
});

module.exports = router;
