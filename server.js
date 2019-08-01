/**
 * @author mukul 
 */
const exp = require('express'),
    node = exp(),
    host = require('http').createServer(node),
    firebase = require('firebase'),
    bp = require('body-parser'),
    multer = require('multer'),
    routes = require('./routes'),
    notice = require('./Database/notice'),
    arrangement = require('./Database/arrangements'),
    home = require('./Database/home'),
    upload = require('./Database/upload'),
    subscription = require('./Database/subscriptions'),
    myConfig = require('./configuration/config.js'),
    admin = require('firebase-admin')
node.set('views', __dirname + '/views');
node.set('firebase', __dirname + '/firebase');
node.set('Database', __dirname + '/Database');
admin.initializeApp(myConfig.adminConfig)
firebase.initializeApp(myConfig.userConfig);

node.use(bp.urlencoded({
    extended: false
}));

//Default tabs
node.get("/", routes.checkConnection, routes.default)
node.get("/home", routes.default)

//Info
node.get("/info", routes.info)

/**
 * searchPass, updateAdmin, DeleteUser, update/AddUser, deleteYearDirectory,
 * deleteBatchDirectory, deleteSemesterDirectory
 */
node.get("/searchUser", home.getUserPass) //, routes.searchId)
node.get("/updateAdmin", home.updateAdmin)
node.get("/deleteIdPass", home.deleteUser)
node.get("/deleteYearId", home.deleteYearId)
node.get("/updateRecord", home.updateRecord)
node.post("/deleteYear", home.deleteYear)
/*
node.post  ("/deleteBatch",                     home.deleteBatch)
node.post  ("/deleteSem",                       home.deleteSem)
*/

/**
 * uploadIdPass, updateSeatingArrangement, updateMarkSheet, updateNoticeFiles
 */
node.get("/upload", routes.upload)
node.post("/uploadIdPass", multer().array('userDetails', 1000), upload.uploadUserDetails)
node.post("/updateSeatingArrangement", upload.updateSeatingArrangement)
node.post("/updateMarkSheet", upload.updateMarkSheet)
node.post("/updateNoticeFiles", upload.updateNoticeFiles)


/**
 * Notice <= page, getNotice, updateNotice
 */
node.get("/notice", notice.notice)
node.get("/getNotice", notice.getNotice)
node.get("/updateNotice", notice.updateNotice)

/**
 * Arrangement <= page, getArrangement, deleteArrangement
 */
node.get("/arrangements", arrangement.arrangements)
node.get("/getArrangement", arrangement.getArrangement)
node.post("/deleteSeatingArrangement/:year", arrangement.deleteArrangement)

/**
 * Subscription <= notify, notifyYear, notifyStudent, notifySpecific
 */
node.get("/subscription", routes.subscription)
node.post("/notify", subscription.notify)
node.post("/notifyYear", subscription.notifyYear)
node.post("/notifyStudent", subscription.notifyStudent)
node.post("/notifySpecific", subscription.notifySpecific)


module.exports.host = () => {
    host.listen(2015)
}