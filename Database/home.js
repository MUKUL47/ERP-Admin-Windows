const firebaseShortcut = require('../firebase/firebaseShortcut')
var firebase = require('firebase')
const admin = require('firebase-admin')
/**
 * searchPass, updateAdmin, DeleteUser, update/AddUser, deleteYearDirectory,
 * deleteBatchDirectory, deleteSemesterDirectory
 */
module.exports.getUserPass = (req,res,next)=>{
    T = undefined
    firebaseShortcut.dB().then((s)=>{
      s.forEach((i)=>{
      var passId = i.val(); 
      for (var i = 0, keys = Object.keys(passId), ii = keys.length; i < ii; i++) {
          if(keys[i].toUpperCase() === req.query.id.toUpperCase()){     
            T = keys[i].toUpperCase()+" : "+passId[keys[i]]    
          }};})
}).then(()=>{
  module.exports.T = T
  next() 
})
};

    module.exports.updateAdmin = (req, res, next)=>{
     firebaseShortcut.setDbReference("ADMIN/ADMIN","Updated at : "+new Date().toString().substring(0,25)+"\n"+req.query.admin)
    .then(()=>{
         res.render("index.ejs",{userPass : "Admin : "+req.query.admin })
        })
  }

  module.exports.deleteUser = (req,res,next)=>{
    let year = req.query.id
    firebaseShortcut.deleteDbReference(year.substring(0,4)+"/"+year.toUpperCase())
    .then(
      res.render("index.ejs",{userPass : year+" deleted"})
    ).catch(
      res.render("index.ejs",{userPass : "Error"})
    )
  }

  module.exports.deleteYearId = (req,res,next)=>{    
    (async function(){
      let year = req.query.year
      try{
        await firebaseShortcut.deleteDirectory(year)
        await firebaseShortcut.deleteDbReference(year)      
        res.render("index.ejs",{userPass : "Deleted"})
      }
      catch(err){
        res.render("index.ejs",{userPass : "Error"})
      } 
    }())   
  }
  
  module.exports.updateRecord = (req,res,next)=>{
    firebaseShortcut.setDbReference("StudentLogs/"+
        (req.query.id).substring(0,4)+"/"+(req.query.id).toUpperCase(),req.query.pass)
    .then((err)=>{
      res.render("index.ejs",{userPass : req.query.id +" updated"})
    })
  }

  module.exports.deleteYear = (req,res)=>{ 
    firebaseShortcut.deleteDbReference(
        req.body.year+"/seatingArrangement").then(
      ()=>{
        firebaseShortcut.deleteDirectory(req.body.year).then(
          res.render("index.ejs",{userPass : "directory : /"+req.body.year+" deleted!"}) )
      })  
  }
  
  module.exports.deleteBatch = (req,res)=>{
    firebaseShortcut.deleteDirectory(req.body.year+"/"+req.body.batch).then(
      res.render("index.ejs",{userPass : "directory : /"+req.body.year+"/"+req.body.batch+" deleted!"}) 
    )
  }
  
  module.exports.deleteSem = (req,res)=>{
    firebaseShortcut.deleteDirectory(req.body.year+"/"+req.body.batch+"/"+req.body.sem)
    .then(
      res.render("index.ejs",{userPass : "directory : /"+req.body.year+"/"+req.body.batch+"/"+req.body.sem+" deleted!"})  
    )
  }