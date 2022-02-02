var express = require("express");
var nodemailer = require('nodemailer');
var router = express.Router();


router.post("/", 
async (req, res) => {
  const {email} = req.body;
  let transporter = nodemailer.createTransport({
    port: 587,
    host: "smtp.ethereal.email",
    auth: {
      user: 'timmothy.fadel25@ethereal.email',
      pass: '2Tedb1bHW38Rb22YzE'
          },
    secure: false,
  });
  let msg = await transporter.sendMail({
    from: 'timmothy.fadel25@ethereal.email',  // sender address
    to: `${email}`,   // list of receivers
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    });
  await transporter.sendMail(msg);
  
  res.send("email sent")
})


module.exports = router;
