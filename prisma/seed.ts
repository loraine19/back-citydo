import { $Enums, AssistanceLevel, PrismaClient, Address, Service } from '@prisma/client';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { fr, base, Faker, } from '@faker-js/faker';
import type { LocaleDefinition } from '@faker-js/faker';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { CreateGroupUserDto } from 'src/group-users/dto/create-group-user.dto';
import { CreateParticipantDto } from 'src/participants/dto/create-participant.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { CreateLikeDto } from 'src/likes/dto/create-like.dto';
import { CreateVoteDto } from 'src/votes/dto/create-vote.dto';
import { Decimal, } from '@prisma/client/runtime/library';
import { CreateFlagDto } from 'src/flags/dto/create-flag.dto';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
import { getEnumVal } from 'middleware/GetPoints';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsService } from 'src/events/events.service';
import { AddressService } from 'src/addresses/address.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MailerService } from 'src/mailer/mailer.service';
import { GroupsService } from 'src/groups/groups.service';
import { GroupUsersService } from 'src/group-users/group-users.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ParticipantsService } from 'src/participants/participants.service';
import { ServicesService } from 'src/service/service.service';
import { IssuesService } from 'src/issues/issues.service';
import { PostsService } from 'src/posts/posts.service';
import { LikesService } from 'src/likes/likes.service';
import { VotesService } from 'src/votes/votes.service';
import { FlagsService } from 'src/flags/flags.service';
import { MessagesService } from 'src/messages/messages.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
const mailerService = new MailerService();
const notifsGateway = new NotifsGateway();
const notificationsService = new NotificationsService(prismaService, mailerService, notifsGateway)
const addressService = new AddressService(prismaService)
const user = new UsersService(prismaService)
const groupsService = new GroupsService(prismaService)
const groupUsersService = new GroupUsersService(prismaService)
const profilesService = new ProfilesService(prismaService, addressService)
const eventService = new EventsService(prismaService, notificationsService, addressService)
const participantsService = new ParticipantsService(prismaService, notificationsService)
const servicesService = new ServicesService(prismaService, notificationsService)
const issuesService = new IssuesService(prismaService, notificationsService)
const postsService = new PostsService(prismaService, notificationsService)
const likesService = new LikesService(prismaService, notificationsService)
const votesService = new VotesService(prismaService, notificationsService)
const flagsService = new FlagsService(prismaService, notificationsService)
const messagesService = new MessagesService(prismaService, notificationsService)

/// GENERE IMAGE FROM SEED 
export const getImageBlob = async (url: string): Promise<Uint8Array<ArrayBufferLike>> => {
  let response = await fetch(url);
  let blob = await response.blob();
  let buffer = Buffer.from(await blob.arrayBuffer());
  // return "data:" + blob.type + ';base64,' + buffer.toString('base64');
  return buffer;
}
const customLocale: LocaleDefinition = {
  location: {
    city_pattern: ['Marseille'],
    street_pattern: ['boulevard de la corderie', 'rue de la république', 'rue de la canebière', 'traverse du moulin de la villette', "Rue Désirée Clary", "Boulevard de Paris", "Rue de Lyon", "Rue Jean Cristofol", "Rue Félix Pyat", "Rue Loubon",
      "Boulvard Roger Salengro", "Rue Odette Jasse", "Rue de Ruffi", "Rue Ibrahim Ali"],
    PhoneModule: ['+33'],
    postcode: ['13001', '13002', '13003'],
    latitude: { min: 43.303, max: 43.318 },
    longitude: { min: 5.360, max: 5.375 },
    building_number: Array.from({ length: 70 }, (_, i) => (i + 1).toString()),
  }
};

export const newFaker = new Faker({
  locale: [customLocale, fr, base],
});

const max = 30;

const CreateRandomAddress = async (): Promise<CreateAddressDto> => {
  let zipcode: string;
  let city: string;
  let address: string;

  const fetchGPS = async () => {
    zipcode = newFaker.location.zipCode();
    city = newFaker.location.city();
    address = newFaker.location.streetAddress();
    console.log(`Fetching GPS for ${address}, ${city}, ${zipcode}`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&postalcode=${encodeURIComponent(zipcode)}&format=json`);
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: new Decimal(data[0].lat),
        lng: new Decimal(data[0].lon)
      };
    } else {
      console.log('No GPS found, retrying...');
      return fetchGPS();
    }
  };

  const { lat, lng } = await fetchGPS();

  // const lat = new Decimal(newFaker.location.latitude(customLocale.location.latitude));
  // const lng = new Decimal(newFaker.location.longitude(customLocale.location.longitude));
  return {
    zipcode,
    city,
    address,
    lat,
    lng
  }
}

const CreateRandomGroup = (): CreateGroupDto => {
  return {
    addressId: newFaker.number.int({ min: 1, max }),
    area: newFaker.number.int({ min: 1, max }),
    rules: newFaker.lorem.lines({ min: 1, max: 10 }),
    name: newFaker.lorem.words({ min: 1, max: 3 }),
  }
}

const CreateRandomUser = async (): Promise<CreateUserDto> => {
  const password = newFaker.internet.password();
  return {
    email: newFaker.internet.email({ provider: 'collectif.com' }),
    password,
    status: $Enums.UserStatus.INACTIVE,
  }
}

const CreateRandomGroupUser = (): CreateGroupUserDto => {
  return {
    groupId: newFaker.number.int({ min: 1, max: 1 }),
    userId: newFaker.number.int({ min: 1, max }),
    role: newFaker.helpers.arrayElement([$Enums.Role.MEMBER, $Enums.Role.MODO]),
  }
}

const CreateRandomProfile = async (): Promise<CreateProfileDto> => {
  const addressData = await CreateRandomAddress();
  let Address: Address;
  const exist = await prisma.address.findUnique({ where: { address_zipcode: { address: addressData.address, zipcode: addressData.zipcode } } })
  if (!exist) { Address = await prisma.address.create({ data: addressData }) }
  else { Address = exist }
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    Address: Address,
    addressId: Address.id,
    firstName: newFaker.person.firstName(),
    lastName: newFaker.person.lastName(),
    phone: newFaker.phone.number({ style: 'international' }),
    image: newFaker.image.personPortrait(),
    addressShared: newFaker.datatype.boolean(),
    mailSub: $Enums.MailSubscriptions.SUB_1,
    assistance: newFaker.helpers.arrayElement(Object.values($Enums.AssistanceLevel)),
    points: newFaker.number.int({ min: 5, max: 50 }),
    skills: newFaker.lorem.words({ min: 0, max: 3 }),
  }
}

const CreateRandomEvent = async (): Promise<CreateEventDto> => {
  const start = newFaker.date.future({ years: 0.5 });
  const end = new Date(start.getTime() + newFaker.number.int({ min: 1, max: 4 }) * 24 * 60 * 60 * 1000);
  const addressData = await CreateRandomAddress();
  let Address: Address;
  const exist = await prisma.address.findUnique({ where: { address_zipcode: { address: addressData.address, zipcode: addressData.zipcode } } })
  if (!exist) { Address = await prisma.address.create({ data: addressData }) }
  else { Address = exist }
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    Address,
    addressId: Address.id,
    title: 'Evenement ' + newFaker.lorem.words({ min: 3, max: 8 }),
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
    start,
    end,
    category: newFaker.helpers.arrayElement(Object.values($Enums.EventCategory)),
    participantsMin: newFaker.number.int({ min: 1, max: 20 }),
    image: (newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
  }
}

const CreateRandomParticipant = async (): Promise<CreateParticipantDto> => {
  return {
    eventId: newFaker.number.int({ min: 1, max }),
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
  }
}

const CreateRandomService = async (): Promise<CreateServiceDto> => {
  const status = newFaker.helpers.arrayElement(Object.values($Enums.ServiceStep))
  const skill = newFaker.helpers.arrayElement(Object.values($Enums.SkillLevel))
  const hard = newFaker.helpers.arrayElement(Object.values($Enums.HardLevel))
  const userIdResp = status === $Enums.ServiceStep.STEP_0 ? null : newFaker.number.int({ min: 1, max: max / 3 })
  const UserResp = status === $Enums.ServiceStep.STEP_0 ? null : await prisma.profile.findUnique({ where: { userId: userIdResp } })
  const userRespPoints = UserResp ? getEnumVal(UserResp.assistance, AssistanceLevel) : 0
  const base = Number(((getEnumVal(hard, $Enums.HardLevel) / 2 + getEnumVal(skill, $Enums.SkillLevel) / 2) + 1).toFixed(1))
  const points = base + userRespPoints / 2
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    userIdResp,
    type: newFaker.helpers.arrayElement(Object.values($Enums.ServiceType)),
    title: 'Service ' + newFaker.lorem.words({ min: 2, max: 3 }),
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
    category: newFaker.helpers.arrayElement(Object.values($Enums.ServiceCategory)),
    skill,
    hard,
    status,
    image: (newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
    points: getEnumVal(status, $Enums.ServiceStep) > 2 && points || 0
  }
}

const CreateRandomIssue = async (service: Service): Promise<CreateIssueDto> => {
  const user = await prisma.user.findUnique({ where: { id: service.userId }, include: { GroupUser: true } })
  const status = newFaker.helpers.arrayElement(Object.values($Enums.IssueStep));
  const modos = await prisma.user.findMany({
    where: {
      NOT: { id: service.userId },
      AND: { id: { not: service.userIdResp } },
      GroupUser: {
        some: { groupId: { in: user.GroupUser.map(g => g.groupId) }, role: { equals: $Enums.Role.MODO } }
      }
    },
    select: {
      id: true,
      Profile: { include: { Address: true } }
    }
  })
  const userId = newFaker.helpers.arrayElement([service.userId, service.userIdResp]);
  const userIdModo = ((userId !== service.userId && status === $Enums.IssueStep.STEP_0)) ? null : newFaker.helpers.arrayElement(modos.map(m => m.id));
  const userIdModoOn = ((userId !== service.userIdResp && status === $Enums.IssueStep.STEP_0)) ? null : newFaker.helpers.arrayElement(modos.map(m => (m.id !== userIdModo) && m.id))
  return {
    status,
    serviceId: service.id,
    userIdModo,
    userIdModoOn,
    userId,
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
    date: newFaker.date.recent({ days: 30 }),
    image: newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false }),
  }
}

const CreateRandomPost = async (): Promise<CreatePostDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    title: 'Announce ' + newFaker.lorem.words({ min: 3, max: 3 }),
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
    category: newFaker.helpers.arrayElement(Object.values($Enums.PostCategory)),
    image: (newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
    share: newFaker.helpers.arrayElement(Object.values($Enums.Share)),
  }
}

const CreateRandomLike = (): CreateLikeDto => {
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    postId: newFaker.number.int({ min: 1, max }),
  }
}

const CreateRandomPool = (): any => {
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    userIdBenef: newFaker.number.int({ min: 1, max: max / 3 }),
    title: 'Cagnotte ' + newFaker.lorem.words({ min: 3, max: 3 }),
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
  }
}

const CreateRandomSurvey = (): any => {
  const category = newFaker.helpers.arrayElement(Object.values($Enums.SurveyCategory));
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    title: `Sondage ${newFaker.lorem.words({ min: 1, max: 2 })}`,
    description: newFaker.lorem.lines({ min: 1, max: 2 }),
    category,
    image: newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false }),
  }
}

const CreateRandomVote = async (): Promise<CreateVoteDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    targetId: newFaker.number.int({ min: 1, max }),
    target: newFaker.helpers.arrayElement(Object.values($Enums.VoteTarget)),
    opinion: newFaker.helpers.arrayElement(Object.values($Enums.VoteOpinion)),
  }
}

const CreateRandomFlag = async (): Promise<CreateFlagDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    targetId: newFaker.number.int({ min: 1, max: max / 2 }),
    target: newFaker.helpers.arrayElement(Object.values($Enums.FlagTarget)),
    reason: newFaker.helpers.arrayElement(Object.values($Enums.FlagReason)),
  }
}

const CreateRandomMessage = async (): Promise<CreateMessageDto> => {
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    userIdRec: newFaker.number.int({ min: 1, max: max / 3 }),
    message: newFaker.lorem.lines({ min: 1, max: 2 }),
  }
}


async function reset() {
  // Reset the identity columns
  await prisma.$executeRawUnsafe("DELETE FROM `Flag`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Flag` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Token`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Token` AUTO_INCREMENT = 1")
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
  await prisma.$executeRawUnsafe("DELETE FROM `Issue`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Issue` AUTO_INCREMENT = 1")
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
  await prisma.$executeRawUnsafe("DELETE FROM `Notification`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Notification` AUTO_INCREMENT = 1")
  await prisma.$executeRawUnsafe("DELETE FROM `Message`")
  await prisma.$executeRawUnsafe("ALTER TABLE `Message` AUTO_INCREMENT = 1")
}

const seed = async () => {
  await reset()
  // USER no fk 
  const User = async () => {
    await prisma.user.deleteMany({ where: { email: { in: ['test@mail.com', 'lou.hoffmann@gmail.com'] } } });
    await user.create({ email: 'test@mail.com', password: 'passwordtest', status: $Enums.UserStatus.ACTIVE })
    await user.create({ email: 'lou.hoffmann@gmail.com', password: 'lolololo', status: $Enums.UserStatus.ACTIVE })
    while (await prisma.user.count() < max / 3) { await user.create(await CreateRandomUser()) }
  }
  await User()
  console.log('users created ✅ ')

  // ADDRESS no fk 
  const Address = async () => {
    while (await prisma.address.count() < max) {
      const newAddress = await CreateRandomAddress();
      const exist = await prisma.address.findUnique({ where: { address_zipcode: { address: newAddress.address, zipcode: newAddress.zipcode } } })
      if (!exist) {
        await addressService.create(newAddress)
      }
    }
  }
  await Address()
  console.log('addresses created ✅ ')

  // GROUP fk address
  const Group = async () => {
    while (await prisma.group.count() < 1) {
      const { addressId, ...group } = CreateRandomGroup();
      const cond = await prisma.address.findUnique({ where: { id: addressId } });
      if (cond) await groupsService.create({ ...group, addressId })
    }
  }
  await Group()
  console.log('groups created ✅ ')

  // GROUPUSER fk user fk group
  const groupUser = async () => {
    await prisma.groupUser.create({ data: { userId: 1, groupId: 1, role: $Enums.Role.MODO } })
    await prisma.groupUser.create({ data: { userId: 2, groupId: 1, role: $Enums.Role.MODO } })
    while (await prisma.groupUser.count() < max / 3) {
      const { userId, groupId, ...groupUser } = CreateRandomGroupUser();
      const cond = await prisma.groupUser.findUnique({ where: { userId_groupId: { userId, groupId } } });
      const cond2 = await prisma.user.findUnique({ where: { id: userId } });
      if (!cond && cond2) await prisma.groupUser.create({ data: { ...groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } } })

    }
  }
  await groupUser();
  console.log('groupusers created ✅ ')

  // PROFILE fk user fk address fk userSP
  const profile = async () => {
    await prisma.profile.create({
      data: { userId: 1, addressId: 1, userIdSp: 2, firstName: 'Testeur', lastName: 'Test', phone: '+33606060606', image: 'https://avatars.githubusercontent.com/u/71236683?v=4', addressShared: true, mailSub: $Enums.MailSubscriptions.SUB_1, }
    })
    await prisma.profile.create({
      data: { userId: 2, addressId: 2, userIdSp: 1, firstName: 'Loraine', lastName: 'Marseille', phone: '+33606060606', image: 'https://image-uniservice.linternaute.com/image/450/7/1397936247/2954633.jpg', addressShared: true, mailSub: $Enums.MailSubscriptions.SUB_2, }
    })
    while (await prisma.profile.count() < max / 3) {
      {
        const { userId, addressId, ...profile } = await CreateRandomProfile();
        const cond = await prisma.profile.findFirst({ where: { userId: userId } });
        const cond2 = await prisma.user.findUnique({ where: { id: userId } })
        if (!cond && cond2) await prisma.profile.create({ data: { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressId } } } })
      }
    }
  }
  await profile()
  console.log('profiles created ✅ ')


  // EVENT fk address fk user 
  const event = async () => {
    while (await prisma.event.count() < max) {
      await eventService.create(await CreateRandomEvent())
    }
  }
  await event()
  console.log('events created ✅ ')

  //  PARTICIPANT fk user fk event
  const participant = async () => {
    while (await prisma.participant.count() < max * 3) {
      {
        const { userId, eventId, ...participant } = await CreateRandomParticipant();
        const cond = await prisma.participant.findUnique({ where: { userId_eventId: { userId, eventId } } });
        if (!cond) await participantsService.create({ ...participant, userId, eventId })
      }
    }
  }
  await participant()
  console.log('participant created ✅ ')


  // SERVICE fk user fk userResp
  const service = async () => {
    while (await prisma.service.count() < max) {
      const { userId, userIdResp, ...service } = await CreateRandomService();
      if (userId !== userIdResp) {
        const serviceCreated = await servicesService.create({ userId, userIdResp, ...service })
        if (serviceCreated.status !== $Enums.ServiceStep.STEP_0) {
          const serviceUpdated = await servicesService.updatePostResp(serviceCreated.id, userIdResp)
          if (serviceUpdated.status === $Enums.ServiceStep.STEP_4) {
            await issuesService.create(await CreateRandomIssue(serviceUpdated))
          }
        }
      }
    }
  }
  await service()
  console.log('services created ✅ ')

  // POST fk user 
  const post = async () => {
    while (await prisma.post.count() < max) {
      await postsService.create(await CreateRandomPost())
    }
  }
  await post()
  console.log('posts created ✅ ')

  // LIKE fk user fk post 
  const like = async () => {
    while (await prisma.like.count() < max * 2) {
      const { userId, postId, ...like } = CreateRandomLike();
      const cond = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });
      if (!cond) await likesService.create({ ...like, userId, postId })
    }
  }
  await like()
  console.log('likes created ✅ ')

  // POOL fk user fk userBenef 
  const pool = async () => {
    while (await prisma.pool.count() < max) {
      const { userId, userIdBenef, ...pool } = CreateRandomPool();
      const cond = await prisma.pool.findFirst({ where: { userId: userId, userIdBenef: userIdBenef } })
      if (!cond && (userId !== userIdBenef)) await prisma.pool.create({ data: { ...pool, User: { connect: { id: userId } }, UserBenef: { connect: { id: userIdBenef } } } })
    }
  }
  await pool()
  console.log('pools created ✅ ')

  // SURVEY fk user 
  const survey = async () => {
    while (await prisma.survey.count() < max) {
      const { userId, ...survey } = await CreateRandomSurvey();
      await prisma.survey.create({ data: { ...survey, User: { connect: { id: userId } } } })
    }
  }
  await survey()
  console.log('surveys created ✅ ')


  // VOTE fk user 
  const vote = async () => {
    while (await prisma.vote.count() < max * 5) {
      const { userId, targetId, target, ...vote } = await CreateRandomVote();
      const cond = await prisma.vote.findUnique({ where: { userId_target_targetId: { userId, target, targetId } } });
      if (!cond && targetId) await votesService.create({ ...vote, userId, targetId, target })
    }
  }
  await vote();
  console.log('votes created ✅ ')

  // FLAG fk user
  const flag = async () => {
    while (await prisma.flag.count() < max * 2) {
      const { userId, target, targetId, ...flag } = await CreateRandomFlag();
      const cond = await prisma.flag.findUnique({ where: { userId_target_targetId: { userId, target, targetId } } });
      if (!cond) await flagsService.create({ ...flag, userId, target, targetId })
    }
  }
  await flag();
  console.log('flags created ✅ ')


  // MESSAGE fk user
  const message = async () => {
    while (await prisma.message.count() < max * 4) {
      const { userId, userIdRec, ...message } = await CreateRandomMessage();
      await messagesService.create({ ...message, userId, userIdRec })
    }
  }
  await message()
  console.log('messages created ✅ ')
}




seed().then(() => console.log('seed finished successfully ✅✅✅')).finally(async () => { await prisma.$disconnect() }).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})

