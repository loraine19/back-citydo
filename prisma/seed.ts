import { PrismaClient } from '@prisma/client';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { fr, base, Faker, PhoneModule } from '@faker-js/faker';
import type { LocaleDefinition } from '@faker-js/faker';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { CreateGroupUserDto } from 'src/group-users/dto/create-group-user.dto';
import { CreateParticipantDto } from 'src/participants/dto/create-participant.dto';
import { connect } from 'http2';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { CreateLikeDto } from 'src/likes/dto/create-like.dto';
import { arrayBuffer } from 'stream/consumers';
const faker = require('@faker-js/faker/locale/fr');

const prisma = new PrismaClient();
const customLocale: LocaleDefinition = {
  location: {
    city_pattern: ['Marseille'],
    street_name: ['boulevard de la corderie', 'rue de la république', 'rue de la canebière', 'traverse du moulin de la villette', 'stade vélodrome', 'vieux port', 'cours julien', 'rue de la palud', 'rue de la loge'],
    PhoneModule: ['+33'],
    postcode: ['13001', '13002', '13003', '13004', '13005', '13006', '13007', '13008', '13009', '13010', '13011', '13012', '13013', '13014', '13015', '13016']
  }
};

export const newFaker = new Faker({
  locale: [customLocale, fr, base],
});

const max = 10;
const roundsOfHashing = 10;
const Hashing = {
  length: roundsOfHashing,
  memorabale: true,
  algorithm: 'bcrypt',
};

const CreateRandomAddress = (): CreateAddressDto => {
  return {
    zipcode: newFaker.location.zipCode(),
    city: newFaker.location.city(),
    address: newFaker.location.streetAddress(),
    lat: newFaker.location.latitude(),
    lng: newFaker.location.longitude()
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

const CreateRandomUser = (): CreateUserDto => {
  return {
    email: newFaker.internet.email(),
    password: newFaker.internet.password(Hashing),
  }
}

const CreateRandomGroupUser = (): CreateGroupUserDto => {
  return {
    groupId: newFaker.number.int({ min: 1, max }),
    userId: newFaker.helpers.uniqueArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)[0],
    role: newFaker.helpers.arrayElement(['GUEST', 'MEMBER', 'MEMBER']),
  }
}

const CreateRandomProfile = (): CreateProfileDto => {
  return {
    userId: newFaker.helpers.uniqueArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)[0],
    addressId: newFaker.number.int({ min: 1, max: 10 }),
    userIdSp: newFaker.number.int({ min: 1, max }),
    firstName: newFaker.person.firstName(),
    lastName: newFaker.person.lastName(),
    phone: "+33" + newFaker.phone.number(),
    avatar: (Buffer.from(newFaker.image.avatar())).toString('base64'),
    addressShared: newFaker.datatype.boolean(),
    assistance: newFaker.helpers.arrayElement(['NONE', 'LOW', 'MEDIUM', 'HIGH']),
    points: newFaker.number.int({ min: 0, max: 30 }),
    skills: newFaker.lorem.words({ min: 0, max: 3 }),
  }
}

const CreateRandomEvent = (): CreateEventDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    addressId: newFaker.number.int({ min: 1, max }),
    title: 'Event ' + newFaker.lorem.words({ min: 3, max: 8 }),
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
    start: newFaker.date.future(),
    end: newFaker.date.future(),
    category: newFaker.helpers.arrayElement(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4']),
    participantsMin: newFaker.number.int({ min: 1, max: 20 }),
    image: Buffer.from(newFaker.image.urlLoremFlickr({ category: 'social' })).toString('base64'),
  }
}

const CreateRandomParticipant = (): CreateParticipantDto => {
  return {
    eventId: newFaker.helpers.uniqueArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)[0],
    userId: newFaker.number.int({ min: 1, max }),
  }
}

const CreateRandomService = (): CreateServiceDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    userIdResp: newFaker.number.int({ min: 1, max }),
    type: newFaker.helpers.arrayElement(['GET', 'DO']),
    title: 'Service ' + newFaker.lorem.words({ min: 3, max: 6 }),
    description: newFaker.lorem.lines({ min: 1, max: 3 }),
    category: newFaker.helpers.arrayElement(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4']),
    skill: newFaker.helpers.arrayElement(['SKILL_0', 'SKILL_1', 'SKILL_2', 'SKILL_3']),
    hard: newFaker.helpers.arrayElement(['HARD_0', 'HARD_1', 'HARD_2', 'HARD_3']),
    status: newFaker.helpers.arrayElement(['POST', 'RESP', 'VALIDATE', 'FINISH', 'ISSUE'])
  }
}

const CreateRandomPost = (): CreatePostDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    title: 'Post ' + newFaker.lorem.words({ min: 3, max: 6 }),
    description: newFaker.lorem.lines({ min: 1, max: 3 }),
    category: newFaker.helpers.arrayElement(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4', 'CATEGORY_5']),
    image: Buffer.from(newFaker.image.urlLoremFlickr({ category: 'social' })).toString('base64'),
    share: newFaker.helpers.arrayElement(['PHONE', 'EMAIL', 'BOTH'])
  }
}

const CreateRandomLike = (): CreateLikeDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    postId: newFaker.number.int({ min: 1, max })
  }
}

async function reset() {
  // Reset the identity columns
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
    while (await prisma.group.count() < max) {
      const { addressId, ...group } = CreateRandomGroup();
      await prisma.group.create({ data: { ...group, Address: { connect: { id: addressId } } } })

    }
    const group = await prisma.group.findMany();
  }
  await group();

  // USER no fk 
  const User = async () => {
    await prisma.user.deleteMany({ where: { email: 'test@mail.com' } });
    await prisma.user.create({ data: { email: 'test@mail.com', password: 'pawwordtest' } })
    while (await prisma.user.count() < max) { await prisma.user.create({ data: CreateRandomUser() }) }
    const user = await prisma.user.findMany();
  }
  await User();

  // GROUPUSER fk user fk group
  const groupUser = async () => {
    while (await prisma.groupUser.count() < max) {
      const { userId, groupId, ...groupUser } = CreateRandomGroupUser();
      console.log({ ...groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } })
      await prisma.groupUser.create({ data: { ...groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } } })

    }
  }
  await groupUser();

  // PROFILE fk user fk address fk userSP
  const profile = async () => {
    while (await prisma.profile.count() < max) {
      {
        const { userId, addressId, userIdSp, ...profile } = CreateRandomProfile();
        await prisma.profile.create({ data: { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressId } }, UserSp: { connect: { id: userIdSp } } } })
      }
    }
  }
  await profile();


  // EVENT fk address fk user 
  const event = async () => {
    while (await prisma.event.count() < max) {
      const { userId, addressId, ...event } = CreateRandomEvent();
      await prisma.event.create({ data: { ...event, Address: { connect: { id: addressId } }, User: { connect: { id: userId } } } })
    }
  }
  await event();

  //  PARTICIPANT fk user fk event
  const participant = async () => {
    while (await prisma.participant.count() < max) {
      {
        const { userId, eventId, ...participant } = CreateRandomParticipant();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        console.log(user, event)
        await prisma.participant.create({ data: { ...participant, User: { connect: { id: userId } }, Event: { connect: { id: eventId } } } })
      }
    }
  }
  await participant();


  // SERVICE fk user fk userResp
  const service = async () => {
    while (await prisma.service.count() < max) {
      const { userId, userIdResp, ...service } = CreateRandomService();
      await prisma.service.create({ data: { ...service, UserService: { connect: { id: userId } }, UserServiceResp: { connect: { id: userIdResp } } } })
    }
  }
  await service();

  // POST fk user 
  const post = async () => {
    while (await prisma.post.count() < max) {
      const { userId, ...post } = CreateRandomPost();
      await prisma.post.create({ data: { ...post, User: { connect: { id: userId } } } })
    }
  }
  await post();

  // LIKE fk user fk post 
  const like = async () => {
    while (await prisma.like.count() < max + 10) {
      const { userId, postId, ...like } = CreateRandomLike();
      await prisma.like.create({ data: { ...like, User: { connect: { id: userId } }, Post: { connect: { id: postId } } } })
    }
  }
  await like();
}





seed().then(async () => {
  await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
