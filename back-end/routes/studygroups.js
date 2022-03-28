var express = require('express');
var router = express.Router();
let StudygroupModel = require('../models/studygroup.model');
let studyGroupSeriesModel = require('../models/studygroupseries.model');
let UserModel = require('../models/user.model');
var helperUser = require('../helpers/helperUser');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const helperGroupHistory = require('../helpers/helperGroupHistory');
const {
  emitGroupUpdated,
  emitFollowedUpdates,
  attendGroups,
  leaveGroups,
  saveNotification,
} = require('../helpers/helperNotification');

/* (1) Get all study groups*/
router.get('/', helperUser.verifyToken, (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }
  StudygroupModel.find()
    .then(studygroups => {
      res
        .status(200)
        .json(
          studygroups.filter(studygroup => studygroup.endDateTime >= new Date())
        );
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

/* (2) Get all studygroups saved by a user */
router.get('/saved', helperUser.verifyToken, async (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }

  var response = [];
  var promises = [];
  req.user.savedStudygroups.forEach(groupId => {
    promises.push(
      StudygroupModel.findById(groupId.toString()).then(studygroup => {
        if (studygroup) response.push(studygroup);
      })
    );
  });

  /* based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all  */
  Promise.all(promises).then(() => res.status(200).json(response));
});

/* (3) Get all studygroups the current logged in user is registered for */
router.get(
  '/registered',
  helperUser.verifyToken,
  helperGroupHistory.updateGroupHistory,
  async (req, res) => {
    // checking if user is authenticated
    if (!req.user) {
      res.status(401).send({ message: 'Invalid JWT token' });
      return;
    }

    var response = [];
    var promises = [];
    req.user.registeredStudygroups.forEach(groupId => {
      promises.push(
        StudygroupModel.findById(groupId.toString()).then(studygroup => {
          if (studygroup) response.push(studygroup);
        })
      );
    });

    /* based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all  */
    Promise.all(promises).then(() => res.status(200).json(response));
  }
);

/* (4) Get all studygroups the user has attended */
router.get(
  '/attended',
  helperUser.verifyToken,
  helperGroupHistory.updateGroupHistory,
  async (req, res) => {
    // checking if user is authenticated
    if (!req.user) {
      res.status(401).send({ message: 'Invalid JWT token' });
      return;
    }

    StudygroupModel.find({
      _id: {
        $in: req.user.attendedStudygroups,
      },
    }).exec((err, attendedStudygroups) => {
      if (err) res.status(400).send({ message: err });
      res.status(200).json(attendedStudygroups);
    });
  }
);

/* (5) Get an individual study group by ID*/
router.get('/:id', helperUser.verifyToken, (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }
  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(studygroup => {
      res.status(200).json(studygroup);
      return;
    })
    .catch(err => {
      console.log('Error: ' + err);
      res.status(400).json('Error: ' + err);
    });
});

/* (6) Catching a post request with url ./create */
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
  body('finalDate')
    .notEmpty()
    .if(
      body('recurring').equals('weekly') ||
        body('recurring').equals('bi-weekly')
    )
    .notEmpty(),

  (req, res) => {
    // checking if user is authenticated
    if (!req.user) {
      res.status(401).send({ message: 'Invalid JWT token' });
      return;
    }

    let studygroup;

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
      studygroup = new StudygroupModel({
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
        official: req.body.official,
        recurring: req.body.recurring,
      });

      if (req.body.recurring != 'N/A')
        studygroup.recurringFinalDateTime = finalDate;

      studygroup.save().catch(err => res.status(400).json('Error: ' + err));

      newSeries.studyGroups.push(studygroup._id);
      start.setDate(start.getDate() + numDays);
      end.setDate(end.getDate() + numDays);
    } while (start <= finalDate);

    newSeries
      .save()
      .catch(err => res.status(400).json('Error: ' + err))
      .then(() => {
        /* BEGIN Notification */
        const action = 'host';
        emitFollowedUpdates(
          req.user.id.toString(),
          `${req.user.firstName} ${req.user.lastName}`,
          action
        );
        saveNotification(studygroup._id, req.user.id, action);
        /* END Notification */

        res.status(200).json(studygroup);
      });
  }
);

/* (7) Editing a study group by id */

router.patch('/edit/:id', helperUser.verifyToken, async (req, res) => {
  // check whether the user is authenticated as the host of this study group
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }

  const groupId = req.params.id;

  const editAll = req.body.editAll;

  let studyGroup = await StudygroupModel.findById(groupId).catch(err => err => {
    res.status(400).json('Error: ' + err);
    return;
  });

  let emailList = [];
  let usersAndChanges = {};
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
      groups_changed = 'The following group has been changed or cancelled<br>';
      let newStart = new Date(start);
      let newEnd = new Date(end);
      var session;
      if (i < series.studyGroups.length) {
        session = await StudygroupModel.findById(series.studyGroups[i]).catch(
          err => {
            res.status(400).json('Error: ' + err);
            return;
          }
        );
        groups_changed += helperUser.constructMessage(
          session.title,
          session.startDateTime,
          session.endDateTime,
          0
        );

        let isRescheduled = false;
        if (
          session.startDateTime.toString() != newStart.toString() ||
          session.endDateTime.toString() != newEnd.toString()
        ) {
          console.log(session);
          console.log(session.startDateTime + ' : ' + newStart);
          console.log(session.endDateTime + ' : ' + newEnd);
          isRescheduled = true;
        }

        Object.assign(session, req.body);
        session.rescheduled = isRescheduled;
        session.recurringFinalDateTime = req.body.finalDate;
        session.startDateTime = newStart;
        session.endDateTime = newEnd;
        groups_changed += helperUser.constructMessage(
          session.title,
          session.startDateTime,
          session.endDateTime,
          1
        );

        for (let i = 0; i < session.attendees.length; i++) {
          let person = await UserModel.findById(session.attendees[i].id);
          if (!emailList.find(element => element == person.email)) {
            emailList.push(person.email);
          }
          if (usersAndChanges[person.email]) {
            usersAndChanges[person.email].push(groups_changed);
          } else {
            usersAndChanges[person.email] = [groups_changed];
          }
        }
        session.save().catch(err => {
          res.status(400).json('Error: ' + err);
          return;
        });
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
          official: req.body.official,
          recurring: req.body.recurring,
        });
        if (req.body.recurring != 'N/A')
          session.recurringFinalDateTime = req.body.finalDate;

        session.save().catch(err => {
          res.status(400).json('Error: ' + err);
          return;
        });
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
        group = await StudygroupModel.findById(series.studyGroups[i]).catch(
          err => {
            res.status(400).json('Error: ' + err);
            return;
          }
        );
        groups_changed += helperUser.constructMessage(
          group.title,
          group.startDateTime,
          group.endDateTime,
          2
        );
        for (let i = 0; i < group.attendees.length; i++) {
          let person = await UserModel.findById(group.attendees[i].id);
          if (!emailList.find(element => element == person.email)) {
            emailList.push(person.email);
          }
          if (usersAndChanges[person.email]) {
            usersAndChanges[person.email].push(groups_changed);
          } else {
            usersAndChanges[person.email] = [groups_changed];
          }
        }
        group.canceled = true;
        let t = new Date();
        t.setHours(t.getHours() + 24);
        group.canceledAt = t;
        group.save().catch(err => {
          res.status(400).json('Error: ' + err);
          return;
        });
      }
    }
    series.recurring = req.body.recurring;
    series.studyGroups = newStudyGroupsList;
    series.save().catch(err => {
      res.status(400).json('Error: ' + err);
      return;
    });
  } else {
    groups_changed = 'The following group has been changed or cancelled<br>';
    console.log(studyGroup);
    console.log(studyGroup.title);
    groups_changed += helperUser.constructMessage(
      studyGroup.title,
      studyGroup.startDateTime,
      studyGroup.endDateTime,
      0
    );
    for (let i = 0; i < studyGroup.attendees.length; i++) {
      let person = await UserModel.findById(studyGroup.attendees[i].id);

      emailList.push(person.email);
      if (usersAndChanges[person.email]) {
        usersAndChanges[person.email].push(groups_changed);
      } else {
        usersAndChanges[person.email] = [groups_changed];
      }
    }
    let start = new Date(req.body.startDateTime);
    let end = new Date(req.body.endDateTime);
    /* TODO: Notify users once postponed (after notification feature is added) */
    var isRescheduled =
      studyGroup.startDateTime.toString() != start.toString() ||
      studyGroup.endDateTime.toString() != end.toString();

    if (isRescheduled) {
      Object.assign(studyGroup, {
        ...req.body,
        ...{ rescheduled: isRescheduled },
      });
    } else {
      Object.assign(studyGroup, {
        ...req.body,
        ...{ recurringFinalDateTime: req.body.finalDate },
      });
    }
    groups_changed += helperUser.constructMessage(
      studyGroup.title,
      studyGroup.startDateTime,
      studyGroup.endDateTime,
      1
    );

    studyGroup.save().catch(err => res.status(400).json('Error: ' + err));
    /* begin: notification logic */
    emitGroupUpdated(groupId, studyGroup.title, 'edit');
    saveNotification(groupId, null, 'edit');
    /* end */
  }

  let subject = 'Study group details have changed or been cancelled';
  for (let i = 0; i < emailList.length; i++) {
    for (let k = 0; k < usersAndChanges[emailList[i]].length; k++) {
      helperUser.sendEmail(
        emailList[i],
        subject,
        usersAndChanges[emailList[i]][k]
      );
    }
  }

  res.status(200).json(studyGroup);
});

/* (8) Deleting a study group by id */
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
    .catch(err => res.status(400).json('Error: ' + err));
});

/* (9) Canceling a room marks it as inactive then deletes it after a grace period. During the grace period, the host can undo deleting a room. */
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
    res.status(403).send('Permision denied');
    return;
  }
  /* begin https://stackoverflow.com/questions/7687884/add-10-seconds-to-a-date */
  var t = new Date();
  t.setHours(t.getHours() + 24); // 24 hour grace period
  /* end */
  var updatedStudygroup = await StudygroupModel.findByIdAndUpdate(groupId, {
    canceledAt: t,
    canceled: true,
  }).catch(err => {
    res.status(400).json('Error: ' + err);
    return;
  });

  res.status(200).json(updatedStudygroup);
});

/* (10) Undo canceling in case the user decides otherwise */
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
    res.status(403).send({ message: 'Permission denied' });
    return;
  }
  var updatedStudygroup = await StudygroupModel.findByIdAndUpdate(groupId, {
    $unset: { canceledAt: 1 },
    canceled: false,
  }).catch(err => res.status(400).json('Error: ' + err));

  res.status(200).json(updatedStudygroup);
});

/* (11) Attend a study group given an id */
router.post('/attend/:id', helperUser.verifyToken, (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }

  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(async studygroup => {
      const attendee = {
        id: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        imgSrc: req.user.profileImage,
      };

      if (studygroup.attendees.filter(user => user.id == req.user.id).length) {
        res
          .status(400)
          .send({ message: 'User already attends this study group' });
        return;
      }

      if (studygroup.curAttendees >= studygroup.maxAttendees) {
        res.status(400).send({ message: 'Study group is already full' });
        return;
      }

      studygroup.attendees.push(attendee);

      studygroup.curAttendees++;
      studygroup.save();
      req.user.registeredStudygroups.push(studygroup);
      req.user.save();

      /* BEGIN Notification */

      //When req.user attends a new study group, we add it as a new room to their socket.
      await attendGroups(req.user.id, groupId, []);
      //Notify the followers of req.user
      emitFollowedUpdates(
        req.user.id.toString(),
        `${req.user.firstName} ${req.user.lastName}`,
        'attend'
      );
      saveNotification(groupId, req.user.id, 'attend');
      /* END Notification */

      res.status(200).json(studygroup);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json('Error: Invalid study group id');
    });
});

/* (12) Leave a study group given an id */
router.patch('/leave/:id', helperUser.verifyToken, (req, res) => {
  // checking if user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Invalid JWT token' });
    return;
  }

  const groupId = req.params.id;
  StudygroupModel.findById(groupId)
    .then(async studygroup => {
      const studyArr = studygroup.attendees.filter(
        user => user.id == req.user.id
      );
      if (!studyArr.length) {
        res
          .status(400)
          .send({ message: 'User does not attend this study group' });
        return;
      }

      var userIndex = studygroup.attendees.indexOf(studyArr[0]);

      if (userIndex == -1) {
        res
          .status(400)
          .send({ message: 'User does not attend this study group' });
        return;
      }

      if (studygroup.curAttendees <= 0) {
        res.status(400).send({ message: 'Study group is empty' });
        return;
      }

      studygroup.curAttendees--;
      studygroup.attendees.splice(userIndex, 1);
      studygroup.save();

      var studygroupId = req.user.registeredStudygroups.indexOf(studygroup.id);
      if (studygroupId != -1) {
        req.user.registeredStudygroups.splice(studygroupId, 1);
        req.user.save();
      }

      /* begin notification */
      await leaveGroups(req.user.id, groupId, []);
      /* end notification  */
      res.status(200).json(studygroup);
    })
    .catch(() => res.status(404).json('Error: Invalid study group id'));
});

module.exports = router;
