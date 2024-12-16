import { PrismaClient } from '@prisma/client';
import { CreateServiceDto } from 'src/routes/service/dto/create-service.dto';
import { fr, base, Faker, PhoneModule } from '@faker-js/faker';
import type { LocaleDefinition } from '@faker-js/faker';
import { CreateAddressDto } from 'src/routes/address/dto/create-address.dto';
import { CreateGroupDto } from 'src/routes/groups/dto/create-group.dto';
import { CreateUserDto } from 'src/routes/users/dto/create-user.dto';
import { CreateProfileDto } from 'src/routes/profiles/dto/create-profile.dto';
import { CreateEventDto } from 'src/routes/events/dto/create-event.dto';
import { CreateGroupUserDto } from 'src/routes/group-users/dto/create-group-user.dto';
import { CreateParticipantDto } from 'src/routes/participants/dto/create-participant.dto';
import { connect } from 'http2';
const faker = require('@faker-js/faker/locale/fr');

const prisma = new PrismaClient();
const customLocale: LocaleDefinition = {
  local: {
    city_pattern: ['Marseille'],
    street_name: ['boulevard de la corderie', 'rue de la république', 'rue de la canebière', 'traverse du moulin de la villette', 'stade vélodrome', 'vieux port', 'cours julien', 'rue de la palud', 'rue de la loge'],
    street_address: ['{{street_name}} {{building_number}}'],
    PhoneModule: ['+33'],
  }
};

export const newFaker = new Faker({
  locale: [customLocale, fr, fr, fr, base],
});

const max = 1;
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
    rules: newFaker.lorem.lines({ min: 1, max: 3 }),
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
    groupId: newFaker.number.int({ min: 31, max: 40 }),
    userId: newFaker.number.int({ min: 1, max }),
    role: newFaker.helpers.arrayElement(['GUEST', 'MEMBER']),
  }
}

const CreateRandomProfile = (): CreateProfileDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    addressId: newFaker.number.int({ min: 1, max: 10 }),
    userIdSp: newFaker.number.int({ min: 1, max }),
    firstName: newFaker.person.firstName(),
    lastName: newFaker.person.lastName(),
    phone: "+33" + newFaker.phone.number(),
    avatar: newFaker.image.avatar(),
    addressShared: newFaker.datatype.boolean(),
    assistance: newFaker.helpers.arrayElement(['NONE', 'LOW', 'MEDIUM', 'HIGH']),
    points: newFaker.number.int({ min: 0, max: 30 }),
    skills: newFaker.helpers.arrayElements([newFaker.lorem.word(), newFaker.lorem.word(), newFaker.lorem.word(), newFaker.lorem.word()])
  }
}

const CreateRandomEvent = (): CreateEventDto => {
  return {
    userId: newFaker.number.int({ min: 1, max }),
    addressId: newFaker.number.int({ min: 1, max }),
    title: newFaker.lorem.words({ min: 3, max: 8 }),
    description: newFaker.lorem.lines({ min: 1, max: 3 }),
    start: newFaker.date.future(),
    end: newFaker.date.future(),
    category: newFaker.helpers.arrayElement(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4']),
    participantsMin: newFaker.number.int({ min: 1, max: 20 }),
    image: newFaker.image.urlLoremFlickr({ category: 'social' })
  }
}

const CreateRandomParticipant = (): CreateParticipantDto => {
  return {
    eventId: newFaker.number.int({ min: 1, max }),
    userId: newFaker.number.int({ min: 1, max }),
  }
}

const CreateRandomService = (): CreateServiceDto => {
  return {
    userId: newFaker.number.int({ min: 5, max }),
    userIdResp: newFaker.number.int({ min: 1, max }),
    type: newFaker.helpers.arrayElement(['GET', 'DO']),
    title: newFaker.lorem.word(),
    description: newFaker.lorem.word(),
    category: newFaker.helpers.arrayElement(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4']),
    skill: newFaker.helpers.arrayElement(['SKILL_0', 'SKILL_1', 'SKILL_2', 'SKILL_3']),
    hard: newFaker.helpers.arrayElement(['HARD_0', 'HARD_1', 'HARD_2', 'HARD_3']),
    status: newFaker.helpers.arrayElement(['POST', 'RESP', 'VALIDATE', 'FINISH', 'ISSUE'])
  }
}


async function reset() {
  await prisma.event.deleteMany({ where: { id: { gt: 0 } } })
  await prisma.participant.deleteMany({ where: { userId: { gt: 0 } } })
  await prisma.service.deleteMany({ where: { id: { gt: 0 } } })
  await prisma.profile.deleteMany({ where: { id: { gt: 0 } } })
  await prisma.groupUser.deleteMany({ where: { userId: { gt: 0 } } })
  await prisma.user.deleteMany({ where: { id: { gt: 0 } } })
  await prisma.group.deleteMany({ where: { id: { gt: 0 } } })
  await prisma.address.deleteMany({ where: { id: { gt: 0 } } })
}

const seed = async () => {
  await reset()
  // ADDRESS no fk 
  const address = async () => {
    while (await prisma.address.count() < 10) {
      await prisma.address.create({ data: CreateRandomAddress() });
      console.log("hello ", await prisma.address.findMany())
    }
  }
  await address();

  // GROUP fk address
  const group = async () => {
    const ad = await prisma.address.findMany();
    console.log(ad)
    while (await prisma.group.count() < 10) {
      const { addressId, ...group } = await CreateRandomGroup();
      await prisma.group.create({ data: { ...group, Address: { connect: { id: addressId } } } })
    }
  }
  await group();

  // USER no fk 
  await prisma.user.create({ data: { email: 'test@mail.com', password: 'pawwordtest' } })
  for (let i = 0; i < max; i++) { await prisma.user.create({ data: CreateRandomUser() }) }

  // GROUPUSER fk user fk group
  for (let i = 0; i < max; i++) {
    {
      const { userId, groupId, ...groupUser } = CreateRandomGroupUser();
      await prisma.groupUser.create({ data: { ...groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } } })
    }
  }

  // PROFILE fk user fk address fk userSP
  for (let i = 0; i < max; i++) {
    {
      const { userId, addressId, userIdSp, ...profile } = CreateRandomProfile();
      await prisma.profile.create({ data: { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressId } }, UserSp: { connect: { id: userIdSp } } } })
    }
  }

  // EVENT fk address fk user 
  for (let i = 0; i < max; i++) {
    const { userId, addressId, ...event } = CreateRandomEvent();
    await prisma.event.create({ data: { ...event, Address: { connect: { id: addressId } }, User: { connect: { id: userId } } } })
  }

  // PARTICIPANT fk user fk event
  for (let i = 0; i < max; i++) {
    {
      const { userId, eventId, ...participant } = CreateRandomParticipant();
      await prisma.participant.create({ data: { ...participant, User: { connect: { id: userId } }, Event: { connect: { id: eventId } } } })
    }
  }
  // SERVICE fk user fk userResp
  for (let i = 0; i < max; i++) {
    const { userId, userIdResp, ...service } = CreateRandomService();
    await prisma.service.create({ data: { ...service, UserService: { connect: { id: userId } }, UserServiceResp: { connect: { id: userIdResp } } } })
  }
}


seed().then(async () => {
  await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })