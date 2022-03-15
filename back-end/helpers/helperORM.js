const userORM = require('../models/user.model');

module.exports = {
  async fetchUser(userId, allowSensitiveInfo) {
    var errors = [];
    var options = allowSensitiveInfo
      ? { password: 0 }
      : { password: 0, created: 0, email: 0, verified: 0, savedStudygroups: 0 };

    var user = await userORM
      .find({ _id: userId }, options)
      .catch(err => errors.push(err));

    return [user, errors];
  },
  async fetchUserMany(userIds, allowSensitiveInfo) {
    var errors = [];
    var options = allowSensitiveInfo
      ? { password: 0 }
      : { password: 0, created: 0, email: 0, savedStudygroups: 0 };

    var users = await userORM
      .find({ _id: { $in: userIds } }, options)
      .catch(err => errors.push(err));

    return [users, errors];
  },
};
