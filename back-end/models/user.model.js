const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'firstName not provided'],
    },
    lastName: {
      type: String,
      required: [true, 'lastName not provided'],
    },
    userName: {
      type: String,
    },
    banned: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      unique: [true, 'email already exists in database.'],
      lowercase: true,
      trim: true,
      required: [true, 'email not provided'],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: '{VALUE} is not a valid email!',
      },
    },
    role: {
      type: String,
      required: [true, 'Please specify user role'],

      enum: ['Student', 'TA', 'Teacher', 'Admin'],
    },
    verified: {
      type: Boolean,
      required: [true, 'verification state is not provided!'],
    },
    password: {
      type: String,
      required: [true, 'Password is not provided'],
    },
    created: {
      type: Date,
      default: Date.now(),
    },
    savedStudygroups: {
      type: [mongoose.Types.ObjectId],
      default: [],
      required: false,
    },
    registeredStudygroups: {
      type: [mongoose.Types.ObjectId],
      default: [],
      required: false,
    },
    //profile info
    profileImage: {
      type: String,
      default:
        'https://img.freepik.com/free-vector/cute-cat-gaming-cartoon_138676-2969.jpg?size=338&ext=jpg',
      required: false,
    },
    profileAboutMe: { type: String, default: '', required: false },
    profileContactInfo: { type: String, default: '', required: false },
    profileInterests: { type: String, default: '', required: false },
    profileCourses: { type: [String], default: [], required: false },
    profileFollowing: {
      type: [mongoose.Types.ObjectId],
      default: [],
      required: false,
    },
    profileFollowers: {
      type: [mongoose.Types.ObjectId],
      default: [],
      required: false,
    },
  },
  { collection: 'users' }
);

const user = mongoose.model('user', userSchema);

module.exports = user;
