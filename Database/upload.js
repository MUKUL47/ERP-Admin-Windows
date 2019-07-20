const firebaseShortcut = require('../firebase/firebaseShortcut')
// const databse   = require('./database')
const multer    = require('multer')
const path      = require('path')
const firebase      = require('firebase')
const admin = require('firebase-admin')
const async = require('async')

var storage = multer.diskStorage({
    destination: './temp',
    filename: function(req, file, cb){
      cb(null,file.originalname.split(".")[0]+path.extname(file.originalname));
    }
  });

var upload = multer({
    storage: storage
}).array('multFile',1000);



var
    uploadSeatingArrangement = ( file, year)=>{
    let fileName = file.originalname.split(".")[0]
    firebaseShortcut.setDbReference("StudentLogs/"+year+"/"+"seatingArrangement/"+fileName,fileName)  
    admin.storage().bucket().upload(file.path,{
    destination:year+"/seatingArrangement/"+file.filename,
    public:true,
    metadata: {contentType: "application/pdf",cacheControl: "public, max-age=300"}
    },(err, file, apiResponse)=>{})
    },

    updateMarkSheet = (file)=>{
        admin.storage().bucket().upload(file.path,{
        destination:"Results/"+file.filename,
        public:true,
        metadata: {contentType: "application/pdf",cacheControl: "public, max-age=300"}
      },(ercr, file, apiResponse)=>{})
      }

      module.exports.updateMarkSheet = (req,res,err)=>{
          let no = 0
            upload(req,res,(err)=>{
                new Promise((resolve,reject)=>{
                req.files.forEach((f)=>{ 
                   let extension = f.originalname.split(".")
                   if(extension.length == 2 && extension[extension.length-1] === "pdf" ){
                    no += 1
                    updateMarkSheet(f)    
                   }else{
                    reject(`Invalid file name : ${f.originalname} (supports only pdf ex : 2019130MEC0321.pdf) file[s] uploaded : ${no}`) 
                } 
                })
                resolve(`Marksheet[s] updated file[s] uploaded : ${no}`)      
            }).then(msg => res.render("upload.ejs",{userPass : msg}) )
            .catch(err => res.render("upload.ejs",{userPass : err}))
        })
    }

    module.exports.updateNoticeFiles = (req,res,err)=>{
        let fileName
            upload(req,res,(err)=>{
                new Promise((resolve,reject)=>{
                    req.files.forEach((f)=>{ 
                        fileName = f.originalname
                        firebaseShortcut.setDbReference("NoticeFiles/"+f.originalname.split(".")[0],f.originalname)
                        .then(
                            admin.storage().bucket().upload(f.path,{
                                destination:"NoticeFiles/"+f.originalname,
                                public:true
                              },(err, file, apiResponse)=>{
                                  if(err) { reject(fileName) } 
                              })
                          )
                        .catch(err => reject(fileName))
                       })
                       resolve() 
                }).then(msg =>
                    res.render("upload.ejs",{userPass : "Notice file[s] uploaded"}))    
                    .catch(err =>
                    res.render("upload.ejs",{userPass : "Error uploading file : "+fileName})              
                    )   
            })
        
    }
    module.exports.uploadUserDetails = (req,res)=>{
        let filesUploaded = new Array()
        new Promise((resolve,reject)=>{
            req.files.forEach((f)=>{
                let extension = f.originalname.split(".")
                    if(extension.length == 2 && extension[extension.length-1].toLowerCase() === "csv"){
                        filesUploaded.push(f.originalname.split(".")[0])
                        uploadDetails(f.buffer.toString('utf8'))
                    }else{
                        reject(`Invalid file name : ${f.originalname} (supports only csv ex : somefilename.csv) Uploaded remaining files :`)
                    }          
                })
                resolve("Userdetails updated : ")  
        }).then(msg =>
            res.render("upload.ejs",{userPass : msg+filesUploaded })            
        ).catch(err =>  res.render("upload.ejs",{userPass : err+filesUploaded}))

    }
    module.exports.updateSeatingArrangement = (req,res,err)=>{
        filesUploaded = new Array() 
        new Promise((resolve,reject)=>{
            upload(req,res,(err)=>{
                if(req.body.year.length >= 4)   {
                    req.files.forEach((f)=>{       
                        let extension = f.originalname.split(".")
                        if( extension.length == 2 && extension[extension.length-1].toLowerCase() === "pdf"){
                         filesUploaded.push(f.originalname.split(".")[0])
                         uploadSeatingArrangement(f, req.body.year)
                        }else{
                         reject(`Invalid file name : ${f.originalname} (supports only pdf ex : somefilename.pdf) Uploaded remaining files :`)                       
                        }})
                        resolve(`Seating arrangement[s] for ${req.body.year} updated : `)  
                }else{
                    reject(`Invalid year : ${req.body.year} `)                    
                }
            })
                       
        }).then(msg =>
            res.render("upload.ejs",{userPass : msg+filesUploaded})  
        ).catch(err => res.render("upload.ejs",{userPass : err+filesUploaded})  
        )
        }
    
        function uploadDetails(data){
            let idPass = new Array()
            data.split("\n").forEach((i,j)=>{
              if( i.length > 0 ){
                var finalKV   = i.split("\r")[0].split(",")
                 if( finalKV[0].length > 5 ){
                    idPass.push( finalKV[0]+"_"+finalKV[1] )
                 }      
                 }
            })
            idPass.forEach((s)=>{
                s = s.toUpperCase()
                var year = s.substring(0,4),
                    id   = s.split("_")[0]
                    pass = s.split("_")[1]
                firebase.database().ref("StudentLogs/"+year).child(id).set(pass);
            }
          )}