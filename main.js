const { app, BrowserWindow, session, net } = require('electron')
const path = require('path')
require("json-circular-stringify");

// This is the problem. The API takes null but it means no urls are matched
// const filter = null
const filter = {
      urls: ['*://httpbin.org/get']
    }
// This intercepts ALL requests
// const filter = {
//       urls: []
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
        console.log(`win.webContents.session.webRequest has been called for ${JSON.stringify(details)}`)
        details.requestHeaders['My-User-Agent-2'] = 'MyAgent'
        callback({ requestHeaders: details.requestHeaders })
    })

    win.loadFile('index.html')

    const request = net.request({
        method: 'GET',
        protocol: 'http:',
        hostname: 'httpbin.org',
        path: '/get',
        redirect: 'follow'
    });
    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
 
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`)
        });
    });
    request.on('finish', () => {
        console.log('Request is Finished')
    });
    request.on('abort', () => {
        console.log('Request is Aborted')
    });
    request.on('error', (error) => {
        console.log(`ERROR: ${JSON.stringify(error)}`)
    });
    request.on('close', (error) => {
        console.log('Last Transaction has occurred')
    });
    request.setHeader('Content-Type', 'application/json');
    request.end();
}

app.whenReady().then(() => {
    console.log("Ready!!!!")
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        console.log(`session.defaultSession.webRequest has been called for ${JSON.stringify(details)}`)
        details.requestHeaders['My-User-Agent-1'] = 'MyAgent'
        callback({ requestHeaders: details.requestHeaders })
    })

    createWindow()
})

app.on('window-all-closed', () => {
    console.log("Closed")
    app.quit()
})