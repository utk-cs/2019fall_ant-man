// To run this file you will need to put both `main.js` and `basic.html` in the location that you used `npm start`.

// This time we will also include BrowserWindow. 
// You can view documentation on what is possible with this item and other Electron objects here: https://electronjs.org/docs/api 
const {app, BrowserWindow } = require('electron');

// This might be something you will do regularly in javascript if you want to maintain a reference to an object.
// If you do not keep this reference outside of the listener in some form, then it will get picked up by the garbage collector and get deleted.
let win;

app.on('ready', () => {
    // This creates a new BrowserWindow and sets win to be a reference to that new window.
    win = new BrowserWindow({
        //width: 600, // Sets the width by pixel count
        //height: 400, // Sets the height by pixel count
        webPreferences: {
            nodeIntegration: true // This ie extremely important later, but is not used in this example.
        }
    });
    // This is a method of a BrowserWindow that lets you load an html file to view.
    win.loadFile('index.html');
    win.maximize();
    win.on('close', () => {
        // This frees the resources held by 'win' and lets the garbage collector take care of removing the window for you.
        // The garbage collector will only remove things when there is no longer any references to the object.
        win = null;
    });
});