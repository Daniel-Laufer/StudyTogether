var jwt = require('jsonwebtoken');

module.exports = {
  respondJWT(user, res, successMessage) {
    /* Create a token by signing the user id with the private key. */
    var token = jwt.sign(
      { id: user._id, date: Date.now },
      process.env.JWT_SECRET,
      { expiresIn: 3600 } // token expires every 60 mins
    );

    /* Send the token back to client + some user info */
    res.status(200).json({
      user: {
        //user info
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: successMessage,
      token: token,
    });
  },

  /* */
  verifyToken(req, res, next) {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'JWT'
    ) {
      jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.API_SECRET,
        function (err, decode) {
          if (err) req.user = undefined;

          User.findOne({
            _id: decode.id,
          }).exec((err, user) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
            } else {
              req.user = user;
              next();
            }
          });
        }
      );
    } else {
      req.user = undefined;
      next();
    }
  },
};
