let StudygroupModel = require('../models/studygroup.model');

module.exports = {
  /* To determine if token was verified, we check req.user is not null in the endpoint*/
  updateGroupHistory(req, res, next) {
    // check that the studygroup exists
    var promises = [];
    var oldStudygroups = [];
    var newStudygroups = [];

    req.user.registeredStudygroups.forEach(groupId => {
      promises.push(
        StudygroupModel.findById(groupId.toString()).then(studygroup => {
          if (studygroup && studygroup.endDateTime < new Date())
            oldStudygroups.push(studygroup);
          else newStudygroups.push(studygroup);
        })
      );
    });

    /* based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all  */
    Promise.all(promises).then(() => {
      req.user.attendedStudygroups =
        req.user.attendedStudygroups.concat(oldStudygroups);
      req.user.registeredStudygroups = newStudygroups;
      req.user.save();
      next();
    });
  },
};
