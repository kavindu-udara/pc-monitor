const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback) => {
        return ipcOn('statistics', (stats) => callback(stats));
    },
    subscribeChangeView: (callback) => {
        return ipcOn('changeView', (stats) => callback(stats));
    },
    getStaticData: () => ipInvoke("getStaticData"),
    sendFrameActio: (payload) => ipSend("sendFrameAction", payload),
} satisfies Window['electron']);

function ipInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}

function ipSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload: EventPayloadMapping[Key]
) {
    electron.ipcRenderer.send(key, payload);
}