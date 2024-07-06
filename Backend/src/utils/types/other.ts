import * as uuid from "uuid"


const validCleanupTypes = [ "DATABASE", "MEMORY" ]
export type CleanupType = typeof validCleanupTypes[number]

export function isCleanupType(any: any): any is CleanupType {
    if(typeof any !== "string") return false;

    if(!validCleanupTypes.includes(any)) return false;

    return true;
}


export type Uuid = string

export function isUuid(any: any): any is Uuid {
    if(typeof any !== "string") return false;

    if(!uuid.validate(any)) return false;
    
    return true;
}