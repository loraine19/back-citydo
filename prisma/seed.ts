import { $Enums, PrismaClient } from '@prisma/client';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { fr, base, Faker, } from '@faker-js/faker';
import type { LocaleDefinition } from '@faker-js/faker';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { CreateGroupUserDto } from 'src/group-users/dto/create-group-user.dto';
import { CreateParticipantDto } from 'src/participants/dto/create-participant.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { CreateLikeDto } from 'src/likes/dto/create-like.dto';
import * as argon2 from 'argon2';
import { CreatePoolDto } from 'src/pools/dto/create-pool.dto';
import { CreateSurveyDto } from 'src/surveys/dto/create-survey.dto';
import { CreateVoteDto } from 'src/votes/dto/create-vote.dto';
import { FileReader } from '@tanker/file-reader';
import { Decimal } from '@prisma/client/runtime/library';
const faker = require('@faker-js/faker/locale/fr');

const prisma = new PrismaClient();
const customLocale: LocaleDefinition = {
  location: {
    city_pattern: ['Marseille'],
    street_pattern: ['boulevard de la corderie', 'rue de la république', 'rue de la canebière', 'traverse du moulin de la villette', 'stade vélodrome', 'vieux port', 'cours julien', 'rue de la palud', 'rue de la loge'],
    PhoneModule: ['+33'],
    postcode: ['13001', '13002', '13003', '13004', '13005', '13006', '13007', '13008', '13009', '13010', '13011', '13012', '13013', '13014', '13015', '13016'],
  }
};

export const newFaker = new Faker({
  locale: [customLocale, fr, base],
});

const max = 10;

const CreateRandomAddress = (): CreateAddressDto => {
  return {
    zipcode: newFaker.location.zipCode(),
    city: newFaker.location.city(),
    address: newFaker.location.streetAddress(),
    lat: new Decimal(newFaker.location.latitude({ min: 42.8384, max: 48.8399 })),
    lng: new Decimal(newFaker.location.longitude({ min: 5.2219, max: 5.3621 })),
  }
}

const CreateRandomGroup = (): CreateGroupDto => {
  return {
    addressId: newFaker.number.int({ min: 1, max: 4 }),
    area: newFaker.number.int({ min: 1, max }),
    rules: newFaker.lorem.lines({ min: 1, max: 1 }),
    name: newFaker.lorem.words({ min: 1, max: 3 }),
  }
}

const CreateRandomUser = async (): Promise<CreateUserDto> => {
  const password = await argon2.hash(newFaker.internet.password());
  return {
    email: newFaker.internet.email(),
    password
  }
}

const CreateRandomGroupUser = (): CreateGroupUserDto => {
  return {
    groupId: newFaker.number.int({ min: 1, max: 2 }),
    userId: newFaker.number.int({ min: 1, max }),
    role: newFaker.helpers.arrayElement(Object.values($Enums.Role)),
  }
}

/// GENERE IMAGE FROM SEED 
export const getImageBlob = async (url: string): Promise<Uint8Array<ArrayBufferLike>> => {
  let response = await fetch(url);
  let blob = await response.blob();
  let buffer = Buffer.from(await blob.arrayBuffer());
  // return "data:" + blob.type + ';base64,' + buffer.toString('base64');
  return buffer;
}


const CreateRandomProfile = async (): Promise<CreateProfileDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    addressId: newFaker.number.int({ min: 1, max: 10 }),
    userIdSp: newFaker.number.int({ min: 1, max }),
    firstName: newFaker.person.firstName(),
    lastName: newFaker.person.lastName(),
    phone: newFaker.phone.number(),
    image: newFaker.image.urlPicsumPhotos({ width: 200, height: 200, blur: 0 }),
    addressShared: newFaker.datatype.boolean(),
    assistance: newFaker.helpers.arrayElement(Object.values($Enums.Assistance)),
    points: newFaker.number.int({ min: 0, max: 30 }),
    skills: newFaker.lorem.words({ min: 0, max: 3 }),
  }
}

const CreateRandomEvent = async (): Promise<CreateEventDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    addressId: newFaker.number.int({ min: 1, max }),
    title: 'Event ' + newFaker.lorem.words({ min: 3, max: 8 }),
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
    start: newFaker.date.future(),
    end: newFaker.date.future(),
    category: newFaker.helpers.arrayElement(Object.values($Enums.EventCategory)),
    participantsMin: newFaker.number.int({ min: 1, max: 20 }),
    image: (newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
  }
}

const CreateRandomParticipant = (): CreateParticipantDto => {
  return {
    eventId: newFaker.number.int({ min: 1, max }),
    userId: newFaker.number.int({ min: 1, max }),
  }
}

const CreateRandomService = async (): Promise<CreateServiceDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    userIdResp: newFaker.number.int({ min: 1, max }),
    type: newFaker.helpers.arrayElement(Object.values($Enums.ServiceType)),
    title: 'Service ' + newFaker.lorem.words({ min: 3, max: 6 }),
    description: newFaker.lorem.lines({ min: 1, max: 3 }),
    category: newFaker.helpers.arrayElement(Object.values($Enums.ServiceCategory)),
    skill: newFaker.helpers.arrayElement(Object.values($Enums.SkillLevel)),
    hard: newFaker.helpers.arrayElement(Object.values($Enums.HardLevel)),
    status: newFaker.helpers.arrayElement(Object.values($Enums.ServiceStatus)),
    image: await getImageBlob(newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
  }
}

const CreateRandomPost = async (): Promise<CreatePostDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    title: 'Post ' + newFaker.lorem.words({ min: 3, max: 6 }),
    description: newFaker.lorem.lines({ min: 1, max: 3 }),
    category: newFaker.helpers.arrayElement(Object.values($Enums.PostCategory)),
    image: (newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
    share: newFaker.helpers.arrayElement(Object.values($Enums.Share)),
  }
}

const CreateRandomLike = (): CreateLikeDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    postId: newFaker.number.int({ min: 1, max }),
  }
}


const CreateRandomPool = (): CreatePoolDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    userIdBenef: newFaker.number.int({ min: 1, max }),
    title: 'Pool ' + newFaker.lorem.words({ min: 3, max: 6 }),
    description: newFaker.lorem.lines({ min: 1, max: 3 }),
  }
}

const CreateRandomSurvey = async (): Promise<CreateSurveyDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    title: 'Survey ' + newFaker.lorem.words({ min: 3, max: 6 }),
    description: newFaker.lorem.lines({ min: 1, max: 3 }),
    category: newFaker.helpers.arrayElement(Object.values($Enums.SurveyCategory)),
    image: newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false }),
  }
}


const CreateRandomVote = (): CreateVoteDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    targetId: newFaker.number.int({ min: 1, max }),
    target: newFaker.helpers.arrayElement(Object.values($Enums.VoteTarget)),
    opinion: newFaker.helpers.arrayElement(Object.values($Enums.VoteOpinion)),
  }
}



async function reset() {
  // Reset the identity columns
  await prisma.$executeRawUnsafe("DELETE FROM `Vote`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Vote` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Survey`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Survey` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Pool`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Pool` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Like`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Like` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Post`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Post` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Service`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Service` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Participant`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Participant` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Event`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Event` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Profile`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Profile` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `GroupUser`")
  await prisma.$executeRawUnsafe("ALTER TABLE `GroupUser` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `User`")
  await prisma.$executeRawUnsafe("ALTER TABLE `User` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Group`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Group` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Address`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Address` AUTO_INCREMENT = 1")
}

const seed = async () => {
  await reset()

  // ADDRESS no fk 
  const address = async () => {
    while (await prisma.address.count() < max) {
      await prisma.address.create({ data: CreateRandomAddress() });
    }
    const address = await prisma.address.findMany();
  }
  await address();

  // GROUP fk address
  const group = async () => {
    while (await prisma.group.count() < 2) {
      const { addressId, ...group } = CreateRandomGroup();
      const cond = await prisma.address.findUnique({ where: { id: addressId } });
      if (cond) await prisma.group.create({ data: { ...group, Address: { connect: { id: addressId } } } })
    }
    const group = await prisma.group.findMany();
  }
  await group();

  // USER no fk 
  const User = async () => {
    await prisma.user.deleteMany({ where: { email: 'test@mail.com' } });
    await prisma.user.create({ data: { email: 'test@mail.com', password: await argon2.hash('passwordtest') } })
    while (await prisma.user.count() < max) { await prisma.user.create({ data: await CreateRandomUser() }) }
    const user = await prisma.user.findMany();
  }
  await User();

  // GROUPUSER fk user fk group
  const groupUser = async () => {
    while (await prisma.groupUser.count() < max) {
      const { userId, groupId, ...groupUser } = CreateRandomGroupUser();
      const cond = await prisma.groupUser.findUnique({ where: { userId_groupId: { userId, groupId } } });
      if (!cond) await prisma.groupUser.create({ data: { ...groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } } })

    }
  }
  await groupUser();

  // PROFILE fk user fk address fk userSP
  const profile = async () => {
    while (await prisma.profile.count() < max) {
      {
        const { userId, addressId, userIdSp, ...profile } = await CreateRandomProfile();
        const cond = await prisma.profile.findFirst({ where: { userId: userId } });
        if (!cond) await prisma.profile.create({ data: { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressId } }, UserSp: { connect: { id: userIdSp } } } })
      }
    }
  }
  await profile();


  // EVENT fk address fk user 
  const event = async () => {
    while (await prisma.event.count() < max) {
      const { userId, addressId, ...event } = await CreateRandomEvent()
      await prisma.event.create({ data: { ...event, Address: { connect: { id: addressId } }, User: { connect: { id: userId } } } })
    }
  }
  await event();

  //  PARTICIPANT fk user fk event
  const participant = async () => {
    while (await prisma.participant.count() < max * 3) {
      {
        const { userId, eventId, ...participant } = CreateRandomParticipant();
        const cond = await prisma.participant.findUnique({ where: { userId_eventId: { userId, eventId } } });
        if (!cond) await prisma.participant.create({ data: { ...participant, User: { connect: { id: userId } }, Event: { connect: { id: eventId } } } })
      }
    }
  }
  await participant();


  // SERVICE fk user fk userResp
  const service = async () => {
    while (await prisma.service.count() < max) {
      const { userId, userIdResp, ...service } = await CreateRandomService();
      if (userId !== userIdResp) await prisma.service.create({ data: { ...service, UserService: { connect: { id: userId } }, UserServiceResp: { connect: { id: userIdResp } } } })
    }
  }
  await service();

  // POST fk user 
  const post = async () => {
    while (await prisma.post.count() < max) {
      const { userId, ...post } = await CreateRandomPost();
      await prisma.post.create({ data: { ...post, User: { connect: { id: userId } } } })
    }
  }
  await post();

  // LIKE fk user fk post 
  const like = async () => {
    while (await prisma.like.count() < max * 2) {
      const { userId, postId, ...like } = CreateRandomLike();
      const cond = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });
      if (!cond) await prisma.like.create({ data: { ...like, User: { connect: { id: userId } }, Post: { connect: { id: postId } } } })
    }
  }
  await like();

  // POOL fk user fk userBenef 
  const pool = async () => {
    while (await prisma.pool.count() < max) {
      const { userId, userIdBenef, ...pool } = CreateRandomPool();
      const cond = await prisma.pool.findFirst({ where: { userId: userId, userIdBenef: userIdBenef } })
      if (!cond && (userId !== userIdBenef)) await prisma.pool.create({ data: { ...pool, User: { connect: { id: userId } }, UserBenef: { connect: { id: userIdBenef } } } })
    }
  }
  await pool();

  // POOL fk user fk userBenef 
  const survey = async () => {
    while (await prisma.survey.count() < max) {
      const { userId, ...survey } = await CreateRandomSurvey();
      await prisma.survey.create({ data: { ...survey, User: { connect: { id: userId } } } })
    }
  }
  await survey();


  // VOTE fk user 
  const vote = async () => {
    while (await prisma.vote.count() < max * 2) {
      const { userId, ...vote } = CreateRandomVote();
      const cond = await prisma.vote.findUnique({ where: { userId_target_targetId: { userId, target: vote.target, targetId: vote.targetId } } });
      if (!cond) await prisma.vote.create({ data: { ...vote, User: { connect: { id: userId } } } })
    }
  }
  await vote();
}





seed().then(async () => {
  await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
