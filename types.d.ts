type Statistics = {
    cpuUsage: number;
    ramUsage: number;
    storageUsage: number;
}

type StaticData = {
    totalStorage: number;
    cpuModel: string;
    totalMemoryGB: number;
}

type View = "CPU" | "RAM" | "STORAGE";

type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
    changeView: View;
    sendFrameAction: FrameWindowAction;
}

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
        subscribeChangeView: (callback: (statistics: View) => void) => UnsubscribeFunction;
        getStaticData: () => Promise<StaticData>;
        sendFrameActio: (payload: FrameWindowAction) => void;
    }
}