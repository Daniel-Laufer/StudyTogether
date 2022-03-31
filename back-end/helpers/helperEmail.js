const nodemailer = require('nodemailer');

const getKeyword = string => {
  const regExp = /\[([^)]+)\]/;
  const matches = regExp.exec(string);
  // matches[1] contains the value between the parenthese
  return [matches[1], string.replace(/\[(.+?)\]/g, ' ')];
};

module.exports = {
  //rec_email can be list or single user
  async sendEmail(rec_email, subject, notif) {
    if (!notif) {
      console.log(
        'Err: notif parameter is null!. \n Class: helperEmail.js \n Function : SendEmail(...) '
      );
      return;
    }
    const email = process.env.EMAIL;
    const password = process.env.password;
    const frontendURL = process.env.FRONTEND_URI;
    let { summary, groupTitle, groupHost, groupDescription, groupId } = notif;
    groupDescription = groupDescription.substring(0, 40) + '...';
    const [keywrd, other] = getKeyword(summary);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
      secure: true,
    });
    let msg = {
      from: email, // sender address
      to: `${rec_email}`, // list of receivers
      subject: subject,
      html: `
            <h2>You have new notification! <a href="${frontendURL}/groups/${groupId}">Check it out</a></h2>
            <div style="border:1px solid;padding:10px;width:50%;border-radius: 8px;">
              <p style="font-size:20px;color:#718096"> <b style="color:black;">${keywrd}</b> ${other} </p>
              <p style="color:#718096"> <b style="color:black;">Title:</b> ${groupTitle} </p>
              <p style="color:#718096"> <b style="color:black;">Host:</b> ${groupHost} </p>
              <p style="color:#718096"> <b style="color:black;">Description:</b> ${groupDescription} </p>
              <hr>
              <img src="cid:logo" style="width:412px;height:70;display: block;margin: 0 auto;"/>
            <div>`,
      attachments: [
        {
          filename: 'logoblack.png',
          path: './logo/logoblack.png',
          cid: 'logo',
        },
      ],
    };
    await transporter.sendMail(msg);
    console.log('{STATUS: OK, MESSAGE: Email sent successfully!}');
  },
};
