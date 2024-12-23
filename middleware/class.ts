// import { Address as PrismaAddress, User as PrismaUser, Profile as PrismaProfile, Group as PrismaGroup, Event as PrismaEvent, Participant as PrismaParticipant, Post as PrismaPost, Like as PrismaLike, Pool as PrismaPool, Vote as PrismaVote, Survey as PrismaSurvey, GroupUser as PrismaGroupUser, Service as PrismaService, $Enums } from '@prisma/client';
// import { Decimal } from '@prisma/client/runtime/library';

// export class Address implements PrismaAddress {
//     id: number;
//     address: string;
//     zipcode: string;
//     city: string;
//     lat: Decimal; // or string if needed
//     lng: Decimal; // or string if needed
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class User implements PrismaUser {
//     id: number;
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     role: string; // replaced enum with string
//     createdAt: Date;
//     updatedAt: Date;
//     lastConnection: Date;
// }

// export class Profile implements PrismaProfile {
//     id: number;
//     user: User;
//     userId: number;
//     userIdSp: number;
//     addressId: number;
//     firstName: string;
//     lastName: string;
//     image: string;
//     phone: string;
//     addressShared: boolean;
//     assistance: AssistanceLevel;
//     points: number;
//     skills: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Group implements PrismaGroup {
//     id: number;
//     name: string;
//     description: string;
//     address: Address;
//     addressId: number;
//     area: number;
//     rules: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Event implements PrismaEvent {
//     id: number;
//     name: string;
//     description: string;
//     startAt: Date;
//     endAt: Date;
//     address: Address;
//     addressId: number;
//     group: Group;
//     groupId: number;
//     userId: number;
//     image: string;
//     title: string;
//     start: Date;
//     end: Date;
//     category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3" | "CATEGORY_4" | "CATEGORY_5";
//     participantsMin: number;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Participant implements PrismaParticipant {
//     id: number;
//     event: Event;
//     eventId: number;
//     user: User;
//     userId: number;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Post implements PrismaPost {
//     id: number;
//     content: string;
//     author: User;
//     authorId: number;
//     group: Group;
//     groupId: number;
//     userId: number;
//     image: string;
//     title: string;
//     description: string;
//     category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3" | "CATEGORY_4" | "CATEGORY_5";
//     share: "EMAIL" | "PHONE" | "BOTH";
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Pool implements PrismaPool {
//     id: number;
//     name: string;
//     description: string;
//     group: Group;
//     groupId: number;
//     userId: number;
//     title: string;
//     userIdBenef: number;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Vote implements PrismaVote {
//     id: number;
//     pool: Pool;
//     poolId: number;
//     user: User;
//     userId: number;
//     targetId: number;
//     target: "POOL" | "SURVEY";
//     opinion: "OK" | "NO" | "WO";
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Survey implements PrismaSurvey {
//     id: number;
//     name: string;
//     description: string;
//     group: Group;
//     groupId: number;
//     userId: number;
//     image: string;
//     title: string;
//     category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3";
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class GroupUser implements PrismaGroupUser {
//     id: number;
//     group: Group;
//     groupId: number;
//     user: User;
//     userId: number;
//     role: "GUEST" | "MEMBER";
//     createdAt: Date;
//     updatedAt: Date;
// }

// export class Service implements PrismaService {
//     id: number;
//     name: string;
//     description: string;
//     address: Address;
//     addressId: number;
//     userId: number;
//     image: string;
//     title: string;
//     category: ServiceCategory;
//     userIdResp: number;
//     type: ServiceType;
//     skill: SkillLevel;
//     hard: HardLevel;
//     status: ServiceStatus;
//     createdAt: Date;
//     updatedAt: Date;
// }

// enum TokenType {
//     REFRESH,
//     RESET,
//     VERIFY
// }

// enum Role {
//     MEMBER,
//     GUEST
// }

// enum ServiceType {
//     GET,
//     DO
// }

// enum VoteTarget {
//     SURVEY,
//     POOL
// }

// enum VoteOpinion {
//     OK,
//     NO,
//     WO
// }

// enum FlagTarget {
//     EVENT,
//     POST,
//     SURVEY
// }

// enum Share {
//     EMAIL,
//     PHONE,
//     BOTH
// }

// enum ServiceStep {
//     STEP_0,
//     STEP_1,
//     STEP_2,
//     STEP_3,
//     STEP_4
// }

// enum IssueStep {
//     STEP_0,
//     STEP_1
// }

// enum EventCategory {
//     CATEGORY_1,
//     CATEGORY_2,
//     CATEGORY_3,
//     CATEGORY_4,
//     CATEGORY_5,
//     CATEGORY_6
// }

// enum PostCategory {
//     CATEGORY_1,
//     CATEGORY_2,
//     CATEGORY_3,
//     CATEGORY_4,
//     CATEGORY_5,
//     CATEGORY_6
// }

// enum ServiceCategory {
//     CATEGORY_1,
//     CATEGORY_2,
//     CATEGORY_3,
//     CATEGORY_4,
//     CATEGORY_5,
//     CATEGORY_6
// }

// enum SurveyCategory {
//     CATEGORY_1,
//     CATEGORY_2,
//     CATEGORY_3,
//     CATEGORY_4,
//     CATEGORY_5,
//     CATEGORY_6
// }

// enum AssistanceLevel {
//     LEVEL_0,
//     LEVEL_1,
//     LEVEL_2,
//     LEVEL_3,
//     LEVEL_4
// }

// enum SkillLevel {
//     LEVEL_0,
//     LEVEL_1,
//     LEVEL_2,
//     LEVEL_3,
//     LEVEL_4
// }

// enum HardLevel {
//     LEVEL_0,
//     LEVEL_1,
//     LEVEL_2,
//     LEVEL_3,
//     LEVEL_4
// }