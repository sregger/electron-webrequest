const { app, BrowserWindow, session } = require('electron')
const path = require('path')

const filter = null
// const filter = {
//       urls: ['https://www.github.com/']
//     }

const createWindow = () => {
    console.log("Creating Window")
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
    })

    win.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        console.log(`win.webContents.session.webRequest has been called for ${details}`)
        details.requestHeaders['My-User-Agent'] = 'MyAgent'
        callback({ requestHeaders: details.requestHeaders })
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    console.log("Ready!!!!")
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        console.log(`session.defaultSession.webRequest has been called for ${details}`)
        details.requestHeaders['My-User-Agent'] = 'MyAgent'
        callback({ requestHeaders: details.requestHeaders })
    })

    createWindow()
})

app.on('window-all-closed', () => {
    console.log("Closed")
    app.quit()
})