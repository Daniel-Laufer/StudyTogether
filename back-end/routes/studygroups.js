var express = require('express');
var router = express.Router();
let StudygroupModel = require('../models/studygroup.model');
let studyGroupSeriesModel = require('../models/studygroupseries.model');
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
  body('recurring').notEmpty(),
  body('finalDate').notEmpty(),
  (req, res) => {
    // checking if user is authenticated
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
    let recurring = req.body.recurring;
    let numDays = 0;
    let finalDate = new Date(req.body.finalDate);
    finalDate.setHours(23, 59, 59);
    if (recurring == 'weekly') {
      numDays = 7;
    } else if (recurring == 'bi-weekly') {
      numDays = 14;
    } else {
      finalDate = req.body.startDateTime;
    }
    var newSeries = new studyGroupSeriesModel({
      studyGroups: [],
      finalDateTime: finalDate,
      recurring: req.body.recurring,
    });
    var seriesId = newSeries._id;

    /* study group creation logic  */
    let start = new Date(req.body.startDateTime);
    let end = new Date(req.body.endDateTime);
    do {
      var newStart = new Date(start);
      var newEnd = new Date(end);
      let studygroup = new StudygroupModel({
        title: req.body.title,
        startDateTime: newStart,
        endDateTime: newEnd,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        curAttendees: req.body.curAttendees,
        location: req.body.location,
        maxAttendees: req.body.maxAttendees,
        hostId: req.user.id,
        description: req.body.description,
        tags: req.body.tags,
        seriesId: seriesId,
      });
      studygroup.save().catch(err => res.status(400).json('Error: ' + err));

      newSeries.studyGroups.push(studygroup._id);
      start.setDate(start.getDate() + numDays);
      end.setDate(end.getDate() + numDays);
    } while (start <= finalDate);

    newSeries
      .save()
      .catch(err => res.status(400).json('Error: ' + err))
      .then(() => res.status(200).json('Study group created successfully!'));
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

  const editAll = req.body.editAll;

  const studyGroup = await StudygroupModel.findById(groupId).catch(err =>
    res.status(400).json('Error: ' + err)
  );
  if (editAll) {
    var seriesId = new mongoose.Types.ObjectId(studyGroup.seriesId);
    const series = await studyGroupSeriesModel.findById(seriesId);
    let numDays;
    if (req.body.recurring == 'weekly') {
      numDays = 7;
    } else if (req.body.recurring == 'bi-weekly') {
      numDays = 14;
    }
    let start = new Date(req.body.startDateTime);
    let end = new Date(req.body.endDateTime);
    var newStudyGroupsList = [];
    var i = 0;
    while (start <= new Date(req.body.finalDate)) {
      let newStart = new Date(start);
      let newEnd = new Date(end);
      var session;
      if (i < series.studyGroups.length) {
        session = await StudygroupModel.findById(series.studyGroups[i]).catch(
          err => res.status(400).json('Error: ' + err)
        );

        Object.assign(session, req.body);
        session.startDateTime = newStart;
        session.endDateTime = newEnd;
        session.save().catch(err => res.status(400).json('Error: ' + err));
      } else {
        //var id = mongoose.Types.ObjectId(req.body.hostId); jsut for back end only testing
        session = new StudygroupModel({
          title: req.body.title,
          startDateTime: newStart,
          endDateTime: newEnd,
          phone: req.body.phone,
          imageUrl: req.body.imageUrl,
          curAttendees: req.body.curAttendees,
          location: req.body.location,
          maxAttendees: req.body.maxAttendees,
          hostId: req.user.id,
          description: req.body.description,
          tags: req.body.tags,
          seriesId: seriesId,
        });
        session.save().catch(err => res.status(400).json('Error: ' + err));
      }

      newStudyGroupsList.push(session._id);
      start.setDate(start.getDate() + numDays);
      end.setDate(end.getDate() + numDays);
      i++;
    }
    for (let i = 0; i < series.studyGroups.length; i++) {
      if (
        !newStudyGroupsList.find(
          element => element.toString() == series.studyGroups[i].toString()
        )
      ) {
        await StudygroupModel.findByIdAndDelete(series.studyGroups[i]).catch(
          err => res.status(400).json('Error: ' + err)
        );
      }
    }
    series.recurring = req.body.recurring;
    series.studyGroups = newStudyGroupsList;
    series.save().catch(err => res.status(400).json('Error: ' + err));
  } else {
    Object.assign(studyGroup, req.body);
    studyGroup.save().catch(err => res.status(400).json('Error: ' + err));
  }
  try {
    res.status(200).json('Study group edited succesfully!');
  } catch (err) {
    console.log(err);
  }
});

/* deleting a study group by id */
router.delete('/delete/:id', helperUser.verifyToken, (req, res) => {
  // check whether the user is authenticated as the host of this study group

  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }
  const deleteAll = req.body.deleteAll;
  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => {
      if (studygroup.hostId != req.user.id) {
        res.status(403).send({ message: 'Not study group creator' });
        return;
      }
      console.log(studygroup);
      var seriesId = new mongoose.Types.ObjectId(studygroup.seriesId);
      studyGroupSeriesModel
        .findById(seriesId)
        .then(series => {
          if (deleteAll) {
            for (let i = 0; i < series.studyGroups.length; i++) {
              StudygroupModel.findById(series.studyGroups[i])
                .then(group => {
                  group.delete();
                })
                .catch(err => res.status(400).json('Error: ' + err));
            }
            series.delete();
            res.status(200).json('Study group edited successfully!');
          } else {
            for (let i = 0; i < series.studyGroups.length; i++) {
              if (
                series.studyGroups[i].toString() == studygroup._id.toString()
              ) {
                series.studyGroups.splice(i, 1);
                console.log('here');
                break;
              }
            }
            if (series.studyGroups.length == 0) {
              series.delete();
            } else {
              series.save();
            }

            studygroup.delete();
            res.status(200).json('Study group deleted successfully!');
          }
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: Invalid study group id'));
});

module.exports = router;
