import { $Enums } from "@prisma/client";

export enum EventFilter {
    MINE = 'MINE',
    IGO = 'IGO',
    VALIDATED = 'VALIDATE'
}

export enum ServiceUpdate {
    POST_RESP = 'POST_RESP',
    VALID_RESP = 'VALIDATE_RESP',
    CANCEL_RESP = 'CANCEL_RESP',
    FINISH = 'FINISH',
}

export enum EventSort {
    CREATED_AT = 'CREATED_AT',
    INDAYS = 'INDAYS',
    PARTICIPANTS = 'PARTICIPANTS',
    AZ = 'AZ',
}

export interface EventFindParams {
    filter?: EventFilter;
    step?: $Enums.EventStatus
    category?: $Enums.EventCategory
    sort?: EventSort;
    reverse?: boolean;
    search?: string;
    groupId?: number;
}