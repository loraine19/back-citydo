import { Flag, Group, User, Vote } from "@prisma/client";




export class Pool {
    createdAt: Date = new Date();
    description: string = '';
    id: number = 0;
    name: string = '';
    title: string = '';
    updatedAt: Date = new Date();
    userId: number = 0;
    userIdBenef: number = 0;
    User?: User = {} as User;
    UserBenef?: User = {} as User;
    Votes: Vote[] = [];
    status: PoolSurveyStatus = PoolSurveyStatus.PENDING;
    groupId: number = 0;
    Group: Group = {} as Group;
    neededVotes: number = 0;
    constructor(data?: Partial<Pool>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class PoolDTO {
    description?: string;
    name?: string;
    title?: string;
    userId?: number;
    userIdBenef?: number;
    groupId?: number;
}

export enum PoolSurveyFilter {
    MINE = 'MINE',
    POOL = 'POOL',
    SURVEY = 'SURVEY',
}

export enum PoolSurveyStep {
    NEW = 'NEW',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
    VALIDATED = 'VALIDATED'
}

export enum PoolSurveyStatus {
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
    VALIDATED = 'VALIDATED'
}

export type PoolSurveyPage = { poolsSurveys: (Pool | Survey)[], count: number };

export enum SurveyCategory {
    CATEGORY_1 = 'régles de quartier',
    CATEGORY_2 = 'projet de travaux',
    CATEGORY_3 = 'partage d\'opinion',
    CATEGORY_4 = 'autres projets',
    CATEGORY_5 = 'autre',
}

export enum PoolSurveySort {
    CREATED_AT = 'CREATED_AT',
    USER = 'USER',
    BENEF = 'BENEF',
    TITLE = 'TITLE',
    VOTES = 'VOTES',
}

export class SurveyDTO {
    name?: string;
    description?: string;
    userId?: number;
    image?: string;
    title?: string;
    category?: SurveyCategory;
    groupId?: number;

}

export class Survey {
    id: number = 0;
    User: User = {} as User;
    userId: number = 0;
    title: string = '';
    description: string = '';
    image: string = '';
    category: SurveyCategory = SurveyCategory.CATEGORY_1;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    Votes: Vote[] = []
    Flags: Flag[] = []
    status: PoolSurveyStatus = PoolSurveyStatus.PENDING;
    groupId: number = 0;
    Group: Group = {} as Group;
    neededVotes: number = 0;
    constructor(data?: Partial<Survey>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

//export class PoolSurvey = Pool | Survey 