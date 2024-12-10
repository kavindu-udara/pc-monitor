import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import path from "path";
import { ipcMainHandler, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

// Disable default menu
// Menu.setApplicationMenu(null);

type test = string;

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        title: "Electron Course",
        webPreferences: {
            preload: getPreloadPath(),
        },
        frame: false
    });
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(getUIPath());
    }

    pollResources(mainWindow);

    ipcMainHandler("getStaticData", () => {
        return getStaticData();
    });

    ipcMainOn("sendFrameAction", (payload) => {
        switch(payload){
            case "CLOSE":
                mainWindow.close();
                break;
            case "MAXIMIZE":
                mainWindow.maximize();
                break;
            case "MINIMIZE":
                mainWindow.minimize();
                break;
        }
    });

    createTray(mainWindow);
    handleCloseEvents(mainWindow);
    // add custom menu
    createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
    let willClose = false;
    mainWindow.on('close', (e) => {
        if (willClose) {
            return;
        }
        e.preventDefault();

        // works on mac
        if (app.dock) {
            app.dock.show();
        }
        // close but running on background apps
        mainWindow.hide();
    });

    app.on("before-quit", () => {
        willClose = true;
    });

    mainWindow.on("show", () => {
        willClose = false;
    })
}
