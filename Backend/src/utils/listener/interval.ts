let intervalFunctions: {lastExecution: number, id: string, intervalMinutes: number, f: (() => Promise<void>)}[] = [];

/**
 * For intervals that dont have to be really specific, executed roughly intervalMinutes +- 1 minute
 */
export default function onInterval(id: string, intervalMinutes: number, f: () => Promise<void>, startedAt: number = Date.now()) {
    intervalFunctions.push({lastExecution: startedAt, id, intervalMinutes, f});
}

export async function startIntervals() {
    setInterval(() => {
        const now = Date.now();
        for (const intervalFunction of intervalFunctions) {
            if(now - intervalFunction.lastExecution > intervalFunction.intervalMinutes * 1000 * 60) {
                intervalFunction.f();
                intervalFunction.lastExecution += intervalFunction.intervalMinutes * 1000 * 60;
            }
        }
    }, 1000 * 60)
}