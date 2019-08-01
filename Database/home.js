const firebaseShortcut = require('../firebase/firebaseShortcut')
var firebase = require('firebase')
const admin = require('firebase-admin')
/**
 * searchPass, updateAdmin, DeleteUser, update/AddUser, deleteYearDirectory,
 * deleteBatchDirectory, deleteSemesterDirectory
 */
module.exports.getUserPass = (req, res, next) => {
  let id = req.query.id.toUpperCase().trim()
  if (id.length < 4) {
    res.render("index.ejs", {
      userPass: "Invalid Id"
    })
  } else {
    firebaseShortcut.dB(`StudentLogs/${id.substring(0,4)}`)
      .then(msg => {
        let pass = "ID NOT FOUND"
        msg.forEach(kV => {
          if (kV.key.toUpperCase() === id) pass = kV.val()
        })
        res.render("index.ejs", {
          userPass: `${id} : ${pass}`
        })
      })
      .catch(err => res.render("index.ejs", {
        userPass: err
      }))
  }


}
module.exports.updateAdmin = (req, res, next) => {
  firebaseShortcut.setDbReference("ADMIN/ADMIN", "Updated at : " + new Date().toString().substring(0, 25) + "\n" + req.query.admin)
    .then(() => {
      res.render("index.ejs", {
        userPass: "Admin : " + req.query.admin
      })
    })
    .catch(err => res.render("index.ejs", {
      userPass: err
    }))
}

module.exports.deleteUser = (req, res, next) => {
  let year = req.query.id.toUpperCase()
  firebaseShortcut.deleteDbReference(`StudentLogs/${year.substring(0,4)}/${year}`)
    .then(
      res.render("index.ejs", {
        userPass: year + " deleted"
      })
    ).catch(
      res.render("index.ejs", {
        userPass: "User not found"
      })
    )
}

module.exports.deleteYearId = (req, res, next) => {
  (async function () {
    let year = req.query.year
    try {
      await firebaseShortcut.deleteDirectory()
      await firebaseShortcut.deleteDbReference(`StudentLogs/${year}`)
      res.render("index.ejs", {
        userPass: `${year} Deleted`
      })
    } catch (err) {
      res.render("index.ejs", {
        userPass: `Error : ${err}`
      })
    }
  }())
}

module.exports.updateRecord = (req, res, next) => {
  let id = req.query.id.toUpperCase().trim(),
    pass = req.query.pass.toUpperCase().trim();
  if (id.length < 5) res.render("index.ejs", {
    userPass: `Invalid Id : ${id}`
  })
  else {
    firebaseShortcut.setDbReference(`StudentLogs/${id.substring(0,4)}/${id}`, pass)
      .then((err) => {
        res.render("index.ejs", {
          userPass: `${req.query.id.toUpperCase().trim()} updated`
        })
      }).catch(err =>
        res.render("index.ejs", {
          userPass: `Error : ${err}`
        })
      )
  }
}

module.exports.deleteYear = (req, res) => {
  let year = req.body.year
  firebaseShortcut.deleteDbReference(year).then(
    () => {
      firebaseShortcut.deleteDirectory(year).then(
        res.render("index.ejs", {
          userPass: `Directory : ${year} deleted`
        }))
    }).catch(err =>
    res.render("index.ejs", {
      userPass: `Error : ${err}`
    })
  )
}
/*
module.exports.deleteBatch = (req, res) => {
  firebaseShortcut.deleteDirectory(req.body.year + "/" + req.body.batch).then(
    res.render("index.ejs", {
      userPass: "directory : /" + req.body.year + "/" + req.body.batch + " deleted!"
    })
  )
}

module.exports.deleteSem = (req, res) => {
  firebaseShortcut.deleteDirectory(req.body.year + "/" + req.body.batch + "/" + req.body.sem)
    .then(
      res.render("index.ejs", {
        userPass: "directory : /" + req.body.year + "/" + req.body.batch + "/" + req.body.sem + " deleted!"
      })
    )
}
*/