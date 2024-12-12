
// GROUP
export class Group {
    id: number;
    addressId: number;
    area: number;
    rules: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        addressId: number,
        area: number,
        rules: string,
        name: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.addressId = addressId;
        this.area = area;
        this.rules = rules;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

//// USER
export class User {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    lastConnection: Date;

    constructor(
        id: number,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date,
        lastConnection: Date
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastConnection = lastConnection;
    }
}

///// PROFILE
export class Profile {
    id: number;
    userId: number;
    userId_sp: number;
    addressId: number;
    firstName: string;
    lastName: string;
    addressShared: boolean;
    assistance: 0 | 1 | 2 | 3;
    points: number;
    skills: string[]
    createdAt: Date;
    updatedAt: Date;
    avatar: any;
    phone?: string;

    constructor(
        id: number,
        userId: number,
        userId_sp: number,
        addressId: number = 1,
        firstName: string,
        lastName: string,
        addressShared: boolean = false,
        assistance: 0 | 1 | 2 | 3,
        points: number = 0,
        skills: string[] = [],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
        avatar: any,
        phone?: string,
    ) {
        this.id = id;
        this.userId = userId;
        this.userId_sp = userId_sp;
        this.addressId = addressId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.addressShared = addressShared;
        this.assistance = assistance;
        this.points = points;
        this.skills = skills;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.avatar = avatar;
        this.phone = phone;
    }
}


///// ADRESS
export class Address {
    id: number;
    zipcode: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    createdAt: number;
    updatedAt: number;

    constructor(
        id: number,
        zipcode: string,
        city: string,
        address: string,
        lat: number,
        lng: number,
        createdAt: number,
        updatedAt: number
    ) {
        this.id = id;
        this.zipcode = zipcode;
        this.city = city;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}



///// EVENT 
export class Event {
    id: number;
    userId: number;
    addressId: number;
    start: Date;
    end: Date;
    title: string;
    description: string;
    category: string;
    participants_min: number;
    createdAt: Date;
    updatedAt: Date;
    image?: Blob | string;

    constructor(
        id: number,
        userId: number,
        addressId: number,
        start: Date,
        end: Date,
        title: string,
        description: string,
        category: string,
        participants_min: number,
        createdAt: Date,
        updatedAt: Date,
        image?: Blob | string
    ) {
        this.id = id;
        this.userId = userId;
        this.addressId = addressId;
        this.start = start;
        this.end = end;
        this.title = title;
        this.description = description;
        this.category = category;
        this.participants_min = participants_min;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
    }
}

///// SERVICES
export class Service {
    id: number;
    userId: number;
    userId_resp: number;
    type: 'get' | 'do';
    title: string;
    description: string;
    category: 1 | 2 | 3 | 4;
    skill: 1 | 2 | 3 | 0;
    hard: 1 | 2 | 3 | 0;
    status: 0 | 1 | 2 | 3 | 4
    createdAt: Date;
    updatedAt: Date;
    image?: Blob;
    finishedAt?: Date;


    constructor(
        id: number,
        userId: number,
        userId_resp: number,
        type: 'get' | 'do',
        title: string,
        description: string,
        category: 1 | 2 | 3 | 4,
        skill: 1 | 2 | 3 | 0,
        hard: 1 | 2 | 3 | 0,
        status: 0 | 1 | 2 | 3 | 4,
        createdAt: Date,
        updatedAt: Date,
        image?: Blob,
        finishedAt?: Date,

    ) {
        this.id = id;
        this.userId = userId;
        this.userId_resp = userId_resp;
        this.type = type;
        this.title = title;
        this.description = description;
        this.category = category;
        this.skill = skill;
        this.hard = hard;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
        this.finishedAt = finishedAt;

    }
}



//// ISSUE
export class Issue {
    id: number;
    userId_M: number;
    userId_Mresp: number;
    servicesid: number;
    description: string;
    date: Date;
    status: "solved" | "pending";
    createdAt: Date;
    updatedAt: Date;
    image?: Blob | string;

    constructor(
        id: number,
        userId_M: number,
        userId_Mresp: number,
        servicesid: number,
        description: string,
        date: Date,
        status: "solved" | "pending",
        createdAt: Date,
        updatedAt: Date,
        image?: Blob | string
    ) {
        this.id = id;
        this.userId_M = userId_M;
        this.userId_Mresp = userId_Mresp;
        this.servicesid = servicesid;
        this.description = description;
        this.date = date;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
    }
}

////// SURVEY 
export class Survey {
    id: number;
    userId: number;
    title: string;
    description: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    image?: Blob;

    constructor(
        id: number,
        userId: number,
        title: string,
        description: string,
        category: string,
        createdAt: Date,
        updatedAt: Date,
        image?: Blob
    ) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
    }
}

////POOL
export class Pool {
    id: number;
    userIdCreat: number;
    userIdBenef: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        userIdCreat: number,
        userIdBenef: number,
        title: string,
        description: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.userIdCreat = userIdCreat;
        this.userIdBenef = userIdBenef;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

//// POST 
export class Post {
    id: number;
    userId: number;
    title: string;
    description: string;
    category: string;
    share: ["phone"] | ["email"] | ["phone", "email"];
    createdAt: Date;
    updatedAt: Date;
    image?: Blob | string;
    constructor(
        id: number,
        userId: number,
        title: string,
        description: string,
        category: string,
        share: ["phone"] | ["email"] | ["phone", "email"],
        createdAt: Date,
        updatedAt: Date,
        image?: Blob | string,
    ) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.share = share;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
    }
}


////// JOINCTION 


//// GOUPUSERS
export class GroupUser {
    groupid: number;
    userid: number;
    role: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        groupid: number,
        userid: number,
        role: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.groupid = groupid;
        this.userid = userid;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

//// LIKES 
export class PostUser {
    userId: number;
    postid: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(userId: number, postid: number, createdAt: Date, updatedAt: Date) {
        this.userId = userId;
        this.postid = postid;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

//// PARTICPANTS EVENT 
export class Participant {
    userId: number;
    eventId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        userId: number,
        eventId: number,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.userId = userId;
        this.eventId = eventId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}


//// VOTES
export class Vote {
    userId: number;
    targetid: number;
    target: 'survey' | 'pool';
    opinion: 'ok' | 'no' | 'wo';

    constructor(
        userId: number,
        targetid: number,
        target: 'survey' | 'pool',
        opinion: 'ok' | 'no' | 'wo'
    ) {
        this.userId = userId;
        this.targetid = targetid;
        this.target = target;
        this.opinion = opinion;
    }
}



//// FLAG
export class Flag {
    targetId: number;
    userId: number;
    target: string;
    active: boolean;
    reason: string;
    createdAt: Date | string
    updatedAt: Date | string;

    constructor(
        targetId: number,
        userId: number,
        target: string,
        active: boolean,
        reason: string,
        createdAt: Date | string,
        updatedAt: Date | string
    ) {
        this.targetId = targetId;
        this.userId = userId;
        this.target = target;
        this.active = active;
        this.reason = reason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

