
const firebaseShortcut = require('../firebase/firebaseShortcut')
/**
 * Notice => noticePage, getNotice, UpdateNotice
 */
module.exports.notice = (req,res)=>{  
    firebaseShortcut.dB("StudentLogs").then((s)=>{ 
        firebaseShortcut.p(s).then((years)=>{res.render("notice.ejs",{years : years, notice : undefined, yearSelected : undefined})}) 
    })
  }
  
module.exports.getNotice = (req,res,next)=>{
     new Promise((resolve)=>{
        firebaseShortcut.dB("StudentLogs/"+req.query.years).then((s)=>{ 
          if(s.val().Notice !== undefined){ resolve(s.val().Notice) }
          else throw "Notice is empty, create first to edit : "
           }).
           catch((err)=>{ 
            firebaseShortcut.dB("StudentLogs").then((s)=>{ 
             firebaseShortcut.p(s).then((years)=>{
             res.render("notice.ejs",{years : years, notice : "", yearSelected : err+" "+req.query.years})
            })})})
      })
      .then((notice)=>{
        firebaseShortcut.dB("StudentLogs").then((s)=>{ 
          firebaseShortcut.p(s).then((years)=>{
          res.render("notice.ejs",{years : years, notice : notice.substring(38,notice.length), yearSelected : req.query.years})})
        })
      })
  }
  
  module.exports.updateNotice = (req,res,next)=>{
    if( req.query.updatedNotice.trim().length == 0 ){
      firebaseShortcut.dB("StudentLogs").then((s)=>{ 
          firebaseShortcut.p(s).then((years)=>{
          res.render("notice.ejs",{years : years, notice : "", yearSelected : "Notice cannot be empty"})      
      })})    
    }else{
        firebaseShortcut.setDbReference("StudentLogs/"+req.query.years+"/Notice",
        "Updated at : "+new Date().toString().substring(0,25)+"\n"+req.query.updatedNotice.trim()
        ).then(()=>{
        firebaseShortcut.dB("StudentLogs").then((s)=>{ 
          firebaseShortcut.p(s).then((years)=>{
          res.render("notice.ejs",{years :years , notice : "", yearSelected : "Notice updated for : "+req.query.years})})      
        })  
      })
    }}
  