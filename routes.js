/**
 * @author mukul 
 */
const dns = require('dns');
const home = require('./Database/home');

module.exports.deleteArrangement = (req, res, next) => {
    console.log(req.params.year)

}

module.exports.noticeFiles = (req,res)=>{
    res.render("noticeFiles.ejs")
}

module.exports.default = (req, res) => {
    res.render("index.ejs", {
        userPass: undefined
    })
}

module.exports.subscription = (req, res) => {
    res.render("subscription.ejs", {
        message: undefined
    })
}

module.exports.upload = (req, res) => {
    res.render("upload.ejs", {
        userPass: undefined
    })
}

module.exports.checkConnection = (req, res, next) => {
    dns.resolve('www.google.com', (err) => {
        if (err) {
            res.send('<center><div style="color : blue" ><h1> Not connected to internet </h1>' +
                '<form action="/" method="GET"><input type="submit" value="RETRY"></form></div></center>')
        } else {
            next()
        }
    })
}
module.exports.info = (req, res, next) => {
    res.render("info.ejs")
}