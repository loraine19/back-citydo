
// GROUP
export class Group {
    constructor(
        public readonly id: number,
        public readonly addressId: number,
        public readonly area: number,
        public readonly rules: string,
        public readonly name: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}

//// USER
export class User {
    constructor(
        public readonly id: number,
        public readonly email: string,
        public readonly password: string, // Make password private for security
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public lastConnection?: Date // Make lastConnection optional
    ) { }
}

///// PROFILE
export class Profile {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly userIdSp: number,
        public readonly addressId: number = 1,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly addressShared: boolean = false,
        public readonly assistance: "NONE" | "LOW" | "MEDIUM" | "HIGH" = "NONE",
        public readonly points: number = 0,
        public readonly skills: string[] = [],
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date(),
        public readonly avatar: any,
        public readonly phone?: string,
    ) { }
}


///// ADRESS
export class Address {
    constructor(
        public readonly id: number,
        public readonly zipcode: string,
        public readonly city: string,
        public readonly address: string,
        public readonly lat: number,
        public readonly lng: number,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) { }
}

export class Event {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly addressId: number,
        public readonly start: Date,
        public readonly end: Date,
        public readonly title: string,
        public readonly description: string,
        public readonly category: string,
        public readonly participantsMin: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly image?: Blob | string // Optional image property
    ) { }
}
///// SERVICES
export class Service {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly userIdResp: number,
        public readonly type: 'GET' | 'DO',
        public readonly title: string,
        public readonly description: string,
        public readonly category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3" | "CATEGORY_4",
        public readonly skill: "SKILL_0" | "SKILL_1" | "SKILL_2" | "SKILL_3",
        public readonly hard: "HARD_0" | "HARD_1" | "HARD_2" | "HARD_3",
        public readonly status: "POST" | "RESP" | "VALIDATE" | "FINISH" | "ISSUE",
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly image?: string | null
    ) { }
}


//// ISSUE
export class Issue {
    constructor(
        public readonly id: number,
        public readonly userId_M: number,
        public readonly userId_Mresp: number,
        public readonly servicesid: number,
        public readonly description: string,
        public readonly date: Date,
        public readonly status: "solved" | "pending",
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly image?: Blob | string // Optional image property
    ) { }
}


////// SURVEY 
export class Survey {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly title: string,
        public readonly description: string,
        public readonly category: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly image?: Blob // Optional image property
    ) { }
}

////POOL
export class Pool {
    constructor(
        public readonly id: number,
        public readonly userIdCreat: number,
        public readonly userIdBenef: number,
        public readonly title: string,
        public readonly description: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}

//// POST 
export class Post {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly title: string,
        public readonly description: string,
        public readonly category: string,
        public readonly share: ("phone" | "email")[], // Array of allowed share options
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly image?: Blob | string // Optional image property
    ) { }
}



////// JOINCTION 
//// GOUPUSERS
export class GroupUser {
    constructor(
        public readonly groupid: number,
        public readonly userid: number,
        public readonly role: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}


//// LIKES 
export class PostUser {
    constructor(
        public readonly userId: number,
        public readonly postid: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}

//// PARTICPANTS EVENT 
export class Participant {
    constructor(
        public readonly userId: number,
        public readonly eventId: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}


//// VOTES
export class Vote {
    constructor(
        public readonly userId: number,
        public readonly targetid: number,
        public readonly target: 'survey' | 'pool',
        public readonly opinion: 'ok' | 'no' | 'wo'
    ) { }
}


//// FLAG
export class Flag {
    constructor(
        public readonly targetId: number,
        public readonly userId: number,
        public readonly target: string,
        public readonly active: boolean,
        public readonly reason: string,
        public readonly createdAt: Date | string, // Flexible createdAt type
        public readonly updatedAt: Date | string  // Flexible updatedAt type
    ) { }
}
