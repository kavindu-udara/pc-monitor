import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from 'url';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandler<Key extends keyof EventPayloadMapping>(
    key: Key, 
    handler: () => EventPayloadMapping[Key]
){
    ipcMain.handle(key, (event) => {
        // validateEventFrame(event.senderFrame);
        if (event.senderFrame) {
          validateEventFrame(event.senderFrame);
          return handler();
        }
    });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
    key: Key, 
    handler: (payload:EventPayloadMapping[Key]) => void
){
    ipcMain.on(key, (event, payload) => {
        // validateEventFrame(event.senderFrame);
        if (event.senderFrame) {
          validateEventFrame(event.senderFrame);
          return handler(payload);
        }
    });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
){
    webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain){
    console.log(frame.url);
    if(isDev() && new URL(frame.url).host === 'localhost:5123'){
        return;
    }
    if(frame.url !== pathToFileURL(getUIPath()).toString()){
        throw new Error('Malicious event!');
    }
}