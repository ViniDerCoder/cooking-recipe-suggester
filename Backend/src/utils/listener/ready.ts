let readyFunctions: {id: string, f: (() => Promise<void>)}[] = [];

export default function onReady(id: string, f: () => Promise<void>) {
    readyFunctions.push({id, f});
}

export async function ready() {
    for (const ready of readyFunctions) {
        await ready.f();
    }
}