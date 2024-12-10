import { useEffect, useState } from "react";

export function useStatistics(dataPointCount: number) {

    const [value, setValue] = useState<Statistics[]>([]);

    useEffect(() => {
        const unsub = window.electron.subscribeStatistics((stats) => {
            setValue(prev => {
                const newData = [...prev, stats];
                if(newData.length > dataPointCount){
                    // remove the first item
                    newData.shift();
                }
                return newData;
            });
        });
        return unsub;
    }, []);

    return value;
}