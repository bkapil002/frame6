const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailServer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.rediffmailpro.com",
      port: 465,           // SSL port
      secure: true,        // true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      name: "samzara.in",   // <-- fixes Invalid HeloHost error
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: '"Samzara" <info@samzara.in>',  // nice formatted from
        to,
        subject,
        html
      });
      console.log(`Email successfully sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

module.exports = new EmailServer();

if (require.main === module) {
  (async () => {
    const emailServer = new EmailServer();
    const success = await emailServer.sendEmail(
      "yourtestemail@gmail.com",       // replace with your test recipient
      "Test Email from Node.js",
      "<h1>Hello! This is a test from Rediffmail SMTP</h1>"
    );
    console.log("Test result:", success);
  })();
}