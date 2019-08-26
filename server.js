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
    noticeFiles = require('./Database/noticeFiles.js')
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
node.get("/home", routes.checkConnection, routes.default)

//Info
node.get("/info", routes.checkConnection, routes.info)

/**
 * searchPass, updateAdmin, DeleteUser, update/AddUser, deleteYearDirectory,
 * deleteBatchDirectory, deleteSemesterDirectory
 */
node.get("/searchUser", routes.checkConnection, home.getUserPass) //, routes.searchId)
node.get("/updateAdmin", routes.checkConnection, home.updateAdmin)
node.get("/deleteIdPass", routes.checkConnection, home.deleteUser)
node.get("/deleteYearId", routes.checkConnection, home.deleteYearId)
node.get("/updateRecord", routes.checkConnection, home.updateRecord)
node.post("/deleteYear", routes.checkConnection, home.deleteYear)
/*
node.post  ("/deleteBatch",                     home.deleteBatch)
node.post  ("/deleteSem",                       home.deleteSem)
*/

/**
 * uploadIdPass, updateSeatingArrangement, updateMarkSheet, updateNoticeFiles
 */
node.get("/upload", routes.checkConnection, routes.upload)
node.post("/uploadIdPass", routes.checkConnection, multer().array('userDetails', 1000), upload.uploadUserDetails)
node.post("/updateSeatingArrangement", routes.checkConnection, upload.updateSeatingArrangement)
node.post("/updateMarkSheet", routes.checkConnection, upload.updateMarkSheet)
node.post("/updateNoticeFiles", routes.checkConnection, upload.updateNoticeFiles)


/**
 * Notice <= page, getNotice, updateNotice
 */
node.get("/notice", routes.checkConnection, notice.notice)
node.get("/getNotice", routes.checkConnection, notice.getNotice)
node.get("/updateNotice", routes.checkConnection, notice.updateNotice)

/**
 * Arrangement <= page, getArrangement, deleteArrangement
 */
node.get("/arrangements", routes.checkConnection, arrangement.arrangements)
node.get("/getArrangement", routes.checkConnection, arrangement.getArrangement)
node.post("/deleteSeatingArrangement/:year", routes.checkConnection, arrangement.deleteArrangement)

/**
 * Subscription <= notify, notifyYear, notifyStudent, notifySpecific
 */
node.get("/subscription", routes.checkConnection, routes.subscription)
node.post("/notify", routes.checkConnection, subscription.notify)
node.post("/notifyYear", routes.checkConnection, subscription.notifyYear)
node.post("/notifyStudent", routes.checkConnection, subscription.notifyStudent)
node.post("/notifySpecific", routes.checkConnection, subscription.notifySpecific)

node.get("/noticefiles",routes.checkConnection,noticeFiles.noticeFiles)
node.post("/deleteFile",routes.checkConnection,noticeFiles.deleteFile)

module.exports.host = () => {
    host.listen(2015)
}