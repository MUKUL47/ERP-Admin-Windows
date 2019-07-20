const firebaseShortcut = require('../firebase/firebaseShortcut')
var firebase = require('firebase')
const admin = require('firebase-admin')
/**
 * Arrangements => arrangementPage, getarrangement, deleteArrangement
 */

module.exports.arrangements = (req,res)=>{
  firebaseShortcut.dB("StudentLogs").then((s)=>{ 
    firebaseShortcut.p(s).then((years)=>{
      res.render("arrangement.ejs",{years : years, arrangements : undefined, yearSelected : undefined})
    }) 
})
//  (async function(){
//   try{
//     let s = await firebaseShortcut.dB(),
//     years = await firebaseShortcut.p(s)
    
//   }catch(err){
//     res.render("arrangement.ejs",{years : years, arrangements : undefined, yearSelected : "some error has occured please refresh the tab"})    
//   }
//  })() 
  }
  
  module.exports.getArrangement = (req,res,next)=>{ 
    (async function f(){
      try{
        let getArrangementFiles = await firebaseShortcut.dB(req.query.years+"/seatingArrangement"),
          files                 = await firebaseShortcut.p(getArrangementFiles),
          s                     = await firebaseShortcut.dB(),
          years                 = await firebaseShortcut.p(s);
      res.render("arrangement.ejs",{years : years, arrangements : files, yearSelected : req.query.years})
      } 
      catch(err){
      res.render("arrangement.ejs",{years : [], arrangements : "", yearSelected : "some error has occured please refresh the tab"})          
      }      
    })()
    /*
    firebaseShortcut.dB(req.query.years+"/seatingArrangement").
        then((s)=>{ 
        firebaseShortcut.p(s).then((files)=>{
        firebaseShortcut.dB().then((s)=>{
            firebaseShortcut.p(s).then((years)=>{
              res.render("arrangement.ejs",{years : years, arrangements : files, yearSelected : req.query.years}) 
            })})})}) 
            */  
  }
  
  module.exports.deleteArrangement = (req, res)=>{
    (async function (){
      let files = req.body.arrangementFile
      let year  = req.params.year
      try{
        await Promise.all([
          firebaseShortcut.deleteDbReference(year+"/seatingArrangement/"+files)
          ,firebaseShortcut.deleteDirectory(year+"/seatingArrangement/"+files+".pdf")
        ])        
        let  s                     = await firebaseShortcut.dB(),
             years                 = await firebaseShortcut.p(s);
             res.render("arrangement.ejs",{years : years,
              arrangements : [],
              yearSelected : "/"+year+"/seatingArrangement/"+R[1]+".pdf deleted"})
      }
      catch(err){
        let  s                     = await firebaseShortcut.dB(),
             years                 = await firebaseShortcut.p(s);
             res.render("arrangement.ejs",{years : years, arrangements : "", yearSelected : "some error has occured please try again! : "+err})
         
      } 
    })()

    /*
    firebaseShortcut.deleteDirectory(year+"/seatingArrangement/"+files+".pdf")
    //firebaseShortcut.deleteDbReference(year+"/seatingArrangement/"+files) 
    firebase.database().ref(year+"/seatingArrangement/"+files).remove()
    .then(()=>{
      firebaseShortcut.dB().then((s)=>{
        firebaseShortcut.p(s).then((years)=>{
            res.render("arrangement.ejs",{years : years,
              arrangements : [],
              yearSelected : "/"+year+"/seatingArrangement/"+files+".pdf deleted"})})})
    })
    */
    
  }