const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./config/.env" });

// module.exports = {
//   transporter: () => {
//     nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     }
//   });
//   }

// }

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

// exports.transporter = transporter

// const mailOptions = {
//     from: '"User Support" <usersupport@markmac.dev>',
//     to: 'mark@markmac.dev',
//     subject: 'Test Email',
//     html: 'Test email sent successfully.',
// };

exports.send = (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    return console.log(error);
    }
    console.log('Successfully sent');
  })
}

// transporter.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take our messages");
//     }
//   });

