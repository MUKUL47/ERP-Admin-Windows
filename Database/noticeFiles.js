const firebaseShortcut = require('../firebase/firebaseShortcut')
var firebase = require('firebase')
const admin = require('firebase-admin')

module.exports.noticeFiles = async (req,res)=>{
 try{
    let s = await firebaseShortcut.dB(`NoticeFiles`)
    
    res.render("noticeFiles.ejs",{files :
      Object.values(JSON.parse(JSON.stringify(s))), msg : JSON.stringify(Object.values(JSON.parse(JSON.stringify(s)))) })
 }
 catch(err){
    res.render("noticeFiles.ejs",{files : undefined, msg : "No File[s] found"})
 }
}

module.exports.deleteFile = async (req,res)=>{
   let file = req.body.file;
 try {
   await Promise.all([
     firebaseShortcut.deleteDbReference(`NoticeFiles/${file.substring(0,file.indexOf('.'))}`),
     firebaseShortcut.deleteDirectory(`NoticeFiles/${file}`)
   ])

   let s = await firebaseShortcut.dB(`NoticeFiles`)
  
   res.render("noticeFiles.ejs",
   {files : Object.values(JSON.parse(JSON.stringify(s))), msg : `${file} deleted successfully`})
 } 
 catch (err) {
   let s = await firebaseShortcut.dB(`NoticeFiles`)
   res.render("noticeFiles.ejs",
   {files : Object.values(JSON.parse(JSON.stringify(s))),
   msg : `Some error has occured please try again : ${err}`})
 }
}