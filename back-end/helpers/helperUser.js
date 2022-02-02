var jwt = require('jsonwebtoken');

module.exports = {
  respondJWT(user, res, successMessage) {
    /* Create a token by signing the user id with the private key. */
    var token = jwt.sign(
      { id: user._id, date: Date.now },
      process.env.JWT_SECRET,
      { expiresIn: 86400 } // token expires every 24 hours - Will be decreased to 60 min
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
};
