/**
 * @author mukul
 * Email
 * Nodemailer
 */
var firebase = require('firebase')
const myConfig = require('../configuration/config.js')

/*module.exports.updateAddSubscription = (req,res)=>{
    let email = req.body.sub 
    firebase.database().ref("Subscriptions").child("Emails").child(email.split("@")[0])
    .set(email).
    then (()=>{ res.render("subscription.ejs",{ message : "email added : "+email }) }).
    catch(()=>{ res.render("subscription.ejs",{ message : "An error has occured please try again later" }) })   
  }  */
  
  

  module.exports.notify = (req,res)=>{
    let emails = new Array()
    firebase.database().ref("Subscriptions").once('value').then((snapshot)=>{ 
      snapshot.forEach((i)=>{  
        emails.push(i)
        })
        let s = JSON.stringify(snapshot)
         res.render("subscription.ejs",{message : Object.values(JSON.parse(s))}) 
      })
    .then(()=>{      
      res.render("subscription.ejs",{message : Object.keys(emails)}) 
      //  var mailOptions = {
      //    from: 'mukudev404@gmail.com',
      //    to: [...emails].join(','),
      //    subject: 'You have a new notice!',
      //    html: '<h1>'+req.body.notify+'</h1>',
      //    priority : "high"
      //  };
      //  myConfig.emailConfig.sendMail(mailOptions, (error, info)=>{
      //    if(info){ res.render("subscription.ejs",{message : emails}) }
      //    else{ res.render("subscription.ejs",{message :emails}) }
      //  })
    })
  }

  module.exports.notifyYear = (req,res)=>{
    let emails = new Set()
    firebase.database().ref("Subscriptions").child("Emails").child(req.body.year).once('value').then((snapshot)=>{ 
      snapshot.forEach((i)=>{ emails.add(i.val()) })})
      .then(()=>{       
        var mailOptions = {
          from: 'mukudev404@gmail.com',
          to: [...emails].join(','),
          subject: 'You have a new notice!',
          html: '<h1>'+req.body.notify+'</h1>'
        };
        myConfig.emailConfig.sendMail(mailOptions, (error, info)=>{
          if(info){ res.render("subscription.ejs",{message : "Notified"}) }
          else{ res.render("subscription.ejs",{message : "Some error has occured please try again"}) }
        })
     })
  }

  module.exports.notifyStudent = (req,res)=>{
    let ee , id = req.body.id
    if( id.length < 5 )  { res.render("subscription.ejs",{message : "Invalid Id"}) }
    firebase.database().ref("Subscriptions").child("Emails").child(id.substring(0,4)).child(id).
    once('value').then((i)=>{ ee = i.val()}
    )
      .then(()=>{       
        var mailOptions = {
          from: 'mukudev404@gmail.com',
          to: ee,
          subject: 'You have a new notice!',
          html: '<h1>'+req.body.notify+'</h1>'
        };
        myConfig.emailConfig.sendMail(mailOptions, (error, info)=>{
          if(info){ res.render("subscription.ejs",{message : "Notified"}) }
          else{ res.render("subscription.ejs",{message : "Invalid email id please check again"}) }
        })
     })
  }

  module.exports.notifySpecific = (req,res)=>{
    let ee , id = req.body.yearBatch, emails = new Set()

    if( id.length < 5 )  { res.render("subscription.ejs",{message : "Invalid Id"}) }
    firebase.database().ref("Subscriptions").child("Emails").child(id.substring(0,4)).
    once('value').then(
      (snapshot)=>{ 
      snapshot.forEach((i)=>{ 
        if(i.key.toString().substring(0,id.length) === id  ){//checkPrefixId(i.key, id)
          emails.add(i.val()) 
        }        
      })})
      .then(()=>{  
        var mailOptions = {
          from: 'mukudev404@gmail.com',
          to: [...emails].join(','),
          subject: 'You have a new notice!',
          html: '<h1>'+req.body.notify+'</h1>'
        };
        myConfig.emailConfig.sendMail(mailOptions, (error, info)=>{
          if(info){ res.render("subscription.ejs",{message : "Notified"}) }
          else{ res.render("subscription.ejs",{message : "Invalid email id please check again  "+[...emails].join(',')}) }
        })
     })    
  }
