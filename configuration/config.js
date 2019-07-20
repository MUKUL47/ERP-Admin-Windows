const serviceAccount = require('./fireBaseTestApp-9a3257faf531.json'),
      admin = require('firebase-admin');
      require('dotenv').config()


module.exports.userConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
}

module.exports.adminConfig = {
    credential: admin.credential.cert(serviceAccount),
    storageBucket : process.env.storageBucket
  }

module.exports.emailConfig = require("nodemailer").createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.user,
      pass: process.env.pass
    }
  })