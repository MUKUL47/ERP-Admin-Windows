var firebase = require('firebase')
const admin = require('firebase-admin')

module.exports.dB = (query)=>{
    if( query ) 
      return firebase.database().ref(query).once('value')
    return firebase.database().ref().once('value')
   }

module.exports.p = (s)=>{
    return new Promise((resolve)=>{
    let years = new Array()
    s.forEach((i)=>{ years.push(i.key) })
    resolve(years)
    })
    }

module.exports.deleteDirectory = (directory)=>{
   return new Promise((resolve,reject)=>{
      admin.storage().bucket().deleteFiles({prefix : directory},(err, file, apiResponse)=>{
        if(!err){
          resolve()
        }else{
          reject(err)
        }
      })
    }) 
  }

module.exports.deleteDbReference = (ref)=>{
    return new Promise((resolve,reject)=>{
      firebase.database().ref(ref).remove((err => {
        if(!err){
          resolve()
        }else{
          reject(err)
        }
      }))
    })
  }

module.exports.setDbReference = (ref, value)=>{
    return firebase.database().ref(ref).set(value)
  }