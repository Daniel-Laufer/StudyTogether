var express = require("express");
var router = express.Router();
let studygroup = require("../models/studygroup.model");

/* get all study groups*/
router.get("/", function (req, res) {
  studygroup
    .find()
    .then((user) => res.status(200).json(studygroup))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
