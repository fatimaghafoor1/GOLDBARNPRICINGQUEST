const { app, BrowserWindow } = require('electron');

let window;

function openWindow() {

    window = new BrowserWindow({
        width: 1200,
        height: 750,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.loadFile("homepage.html");

    window.on("closed", () => {
        window = null;
    });
}


app.whenReady().then(() => {

    openWindow();

    app.on("activate", () => {

        if (BrowserWindow.getAllWindows().length === 0) {
            openWindow();
        }

    });

});


app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});