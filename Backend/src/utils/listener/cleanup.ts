import { CleanupType } from "../types.js";

let cleanupFunctions: {id: string, type: CleanupType, f: (() => Promise<boolean>)}[] = [];

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
        if(!cleanupSuccesfull) console.log("[onCleanup] Cleanup failed for: " + cleanup.id + " (type: " + cleanup.type + ")");
        else console.log("[onCleanup] Cleanup successful for: " + cleanup.id + " (type: " + cleanup.type + ")");
    }
}