/**
 * @author mukul 
 */
const electron = require("electron");
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const server = require('./server')
server.host()
var quit = () => {
  if (process.platform !== "darwin") {
    require("rimraf")("./temp", () => {})
    app.quit();
  }
}
app.on('ready', () => {
  var home = new BrowserWindow({
    width: 500,
    height: 730,
    resizable: false,
    icon: "./Desert.JPG"
  })
  home.loadURL("http://localhost:2015")
  Menu.setApplicationMenu(Menu.buildFromTemplate([{
      label: "Home",
      click: () => {
        home.loadURL("http://localhost:2015")
      }
    },
    {
      label: "Upload",
      click: () => {
        home.loadURL("http://localhost:2015/upload")
      }
    },
    {
      label: "Notice",
      click: () => {
        home.loadURL("http://localhost:2015/notice")
      }
    }, {
      label: "Arrangements",
      click: () => {
        home.loadURL("http://localhost:2015/arrangements")
      }
    }, {
      label: "Subscription",
      click: () => {
        home.loadURL("http://localhost:2015/subscription")
      }
    },
    {
      label: "Notice Files",
      click: () => {
        home.loadURL("http://localhost:2015/noticeFiles")
      }
    }, {
      label: "Exit",
      click: quit
    }
  ]))
})
app.on("window-all-closed", quit);