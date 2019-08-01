const firebaseShortcut = require('../firebase/firebaseShortcut')
var firebase = require('firebase')
const admin = require('firebase-admin')
/**
 * Arrangements => arrangementPage, getarrangement, deleteArrangement
 */

async function getYears() {
  let s = await firebaseShortcut.dB(`StudentLogs`),
    years = await firebaseShortcut.p(s);
  return years
}

async function getArrangementFiles(year) {
  let getArrangementFiles = await firebaseShortcut.dB(`StudentLogs/${year}/seatingArrangement`),
    files = await firebaseShortcut.p(getArrangementFiles);
  return files
}

module.exports.arrangements = (req, res) => {
  (async function () {
    let y;
    await getYears().then(years => y = years)
    res.render("arrangement.ejs", {
      years: y,
      arrangements: undefined,
      yearSelected: undefined
    })
  }())
}

module.exports.getArrangement = (req, res, next) => {
  (async function () {
    let year = req.query.years
    try {
      let years, files;
      await getArrangementFiles(year).then(f => files = f)
      await getYears().then(y => years = y)
      res.render("arrangement.ejs", {
        years: years,
        arrangements: files,
        yearSelected: req.query.years
      })
    } catch (err) {
      res.render("arrangement.ejs", {
        years: [],
        arrangements: "",
        yearSelected: "some error has occured please refresh the tab"
      })
    }
  })()
}

module.exports.deleteArrangement = (req, res) => {
  (async function () {
    let file = req.body.arrangementFile,
      year = req.params.year,
      years;
    try {
      await Promise.all([
        firebaseShortcut.deleteDbReference(`StudentLogs/${year}/seatingArrangement/${file}`),
        firebaseShortcut.deleteDirectory(`${year}/seatingArrangement/${file}.pdf`)
      ])
      await getYears().then(year => years = year);
      res.render("arrangement.ejs", {
        years: years,
        arrangements: [],
        yearSelected: "/" + year + "/seatingArrangement/" + file + ".pdf deleted"
      })
    } catch (err) {
      await getYears().then(year => years = year);
      res.render("arrangement.ejs", {
        years: years,
        arrangements: [],
        yearSelected: "some error has occured please try again! : " + err
      })
    }
  })()

}