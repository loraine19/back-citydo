import { $Enums } from "@prisma/client";

export enum PoolSurveyFilter {
    MINE = 'MINE',
    POOL = 'POOL',
    SURVEY = 'SURVEY',
}

export enum PoolSurveyStep {
    NEW = 'NEW',
    PENDING = 'PENDING',
    VALIDATED = 'VALIDATED',
    REJECTED = 'REJECTED',
}
export enum PoolSurveySort {
    CREATED_AT = 'CREATED_AT',
    USER = 'USER',
    BENEF = 'BENEF',
    TITLE = 'TITLE',
    VOTES = 'VOTES',
}

export interface PoolSurveysFindParams {
    filter?: PoolSurveyFilter;
    category?: $Enums.SurveyCategory;
    step?: PoolSurveyStep;
    sort?: PoolSurveySort
    reverse?: boolean;
    search?: string;
}