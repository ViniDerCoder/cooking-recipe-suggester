let cleanupFunctions: {id: string, type: CleanupType, f: (() => Promise<boolean>)}[] = [];

type CleanupType = "DATABASE" | "MEMORY";

export default function onCleanup(id: string, type: CleanupType, f: () => Promise<boolean>) {
    cleanupFunctions.push({id, type, f});
}

export async function cleanup(type: CleanupType | "ALL" = "ALL") {
    for (const cleanup of cleanupFunctions) {
        switch(type) {
            case "ALL":
            break;
            case "DATABASE":
                if(cleanup.type !== "DATABASE") continue;
            break;
            case "MEMORY":
                if(cleanup.type !== "MEMORY") continue;
            break;
        }
        const cleanupSuccesfull = await cleanup.f();
        if(!cleanupSuccesfull) console.log("Cleanup failed for: " + cleanup.id + " (type: " + cleanup.type + ")");
        else console.log("Cleanup successful for: " + cleanup.id + " (type: " + cleanup.type + ")");
    }
}