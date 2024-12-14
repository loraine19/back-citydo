import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Service } from 'src/class';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
const prisma = new PrismaClient();

const roundsOfHashing = 10;

const Data = {
  address: [
    {
      zipcode: "13001",
      city: "Marseille",
      address: "16 Rue Paradis",
      lat: 43.296482,
      lng: 5.36978,
    },
    {
      zipcode: "75001",
      city: "Paris",
      address: "10 Avenue des Champs-Élysées",
      lat: 48.866667,
      lng: 2.333333,
    },
    {
      zipcode: "69003",
      city: "Lyon",
      address: "Place Bellecour",
      lat: 45.759722,
      lng: 4.842222,
    },
    {
      zipcode: "33000",
      city: "Bordeaux",
      address: "Place de la Bourse",
      lat: 44.840736,
      lng: -0.568,
    },
    {
      zipcode: "44000",
      city: "Nantes",
      address: "Château des Ducs de Bretagne",
      lat: 47.218333,
      lng: -1.553889,
    }
  ],
  groups: [
    {
      addressId: 1,
      area: 150,
      rules: "Pas de nourriture ou de boisson à l'intérieur",
      name: "Quartier Blob",

    },
    {
      addressId: 1,
      area: 80,
      rules: "Réservé aux employés uniquement",
      name: "Salle de réunion",
    }
  ],
  users:
    [
      {
        email: "test@mail.com",
        password: "passwordtest"
      },
      {
        email: "utilisateur1@exemple.fr",
        password: "passwordj"
      },
      {
        email: "utilisateur2@exemple.fr",
        password: "passwordtest"
      },
      {
        email: "utilisateur3@exemple.fr",
        password: "passwordtest"
      },
      {
        email: "utilisateur4@exemple.fr",
        password: "passwordtest"
      },
      {
        email: "utilisateur9@exemple.fr",
        password: "passwordtest"
      },
    ],
  profiles: [
    {
      userId: 1,
      userIdSp: 25,
      addressId: 1,
      firstName: "Jean",
      lastName: "Durant",
      avatar: null,
      phone: "0612457890",
      addressShared: false,
      points: 2.5,
      createdAt: "2024-12-01T08:51:00.000Z",
      updatedAt: "2024-12-01T08:51:00.000Z"
    },
    {
      userId: 2,
      userIdSp: 30,
      addressId: 2,
      firstName: "Marie",
      lastName: "Dupont",
      avatar: null,
      phone: "0248753219",
      addressShared: true,
      points: 50,
      createdAt: "2024-12-01T08:51:00.000Z",
      updatedAt: "2024-12-01T08:51:00.000Z"
    },
    {
      userId: 3,
      userIdSp: 47,
      addressId: 3,
      firstName: "Pierre",
      lastName: "Rossi",
      avatar: null,
      phone: "0369852147",
      addressShared: false,
      points: 120,
      createdAt: "2024-12-01T08:51:00.000Z",
      updatedAt: "2024-12-01T08:51:00.000Z"
    },
    {
      userId: 4,
      userIdSp: 54,
      addressId: 4,
      firstName: "Sophie",
      lastName: "Leroy",
      avatar: null,
      phone: "0498725361",
      addressShared: true,
      points: 300,
      createdAt: "2024-12-01T08:51:00.000Z",
      updatedAt: "2024-12-01T08:51:00.000Z"
    },
    {
      userId: 5,
      userIdSp: 60,
      addressId: 5,
      firstName: "Nicolas",
      lastName: "Moreau",
      avatar: null,
      phone: "0587532190",
      addressShared: false,
      points: 450,
      createdAt: "2024-12-01T08:51:00.000Z",
      updatedAt: "2024-12-01T08:51:00.000Z"
    }
  ],
  events: [
    {
      userId: 1,
      addressId: 1,
      start: "2024-12-02T00:00:00.000Z",
      end: "2024-12-20T00:00:00.000Z",
      title: "Soirée jeux de société",
      description: "Venez passer une soirée conviviale autour de jeux de société !",
      category: "CATEGORY_1",
      participantsMin: 4,
      image: "https://www.very-utile.com/scripts/files/6699a4032add49.55400648/fete-noel.jpg"
    },
    {
      userId: 2,
      addressId: 2,
      start: "2024-12-10T10:00:00.000Z",
      end: "2024-12-10T14:00:00.000Z",
      title: "Atelier DIY : fabrication de couronnes de Noël",
      description: "Apprenez à créer de jolies couronnes de Noël pour décorer votre maison !",
      category: "CATEGORY_1",
      participantsMin: 6,
      image: "https://www.very-utile.com/scripts/files/6699a4032add49.55400648/fete-noel.jpg"
    },
    {
      userId: 3,
      addressId: 3,
      start: "2024-01-21T14:00:00.000Z",
      end: "2024-01-21T18:00:00.000Z",
      title: "Randonnée pédestre dans les calanques de Marseille",
      description: "Partez à la découverte des magnifiques calanques de Marseille en randonnée !",
      category: "CATEGORY_1",
      participantsMin: 8,
      image: null
    },
    {
      userId: 4,
      addressId: 4,
      start: "2024-02-14T19:00:00.000Z",
      end: "2024-02-14T23:00:00.000Z",
      title: "Soirée Saint-Valentin : Dîner aux chandelles",
      description: "Passez une soirée romantique inoubliable pour la Saint-Valentin !",
      category: "CATEGORY_1",
      participantsMin: 2,
      image: null
    },
    {
      userId: 5,
      addressId: 5,
      start: "2024-03-23T10:00:00.000Z",
      end: "2024-03-23T17:00:00.000Z",
      title: "Atelier de cuisine : Pâtisseries de printemps",
      description: "Apprenez à réaliser de délicieux desserts printaniers !",
      category: "CATEGORY_1",
      participantsMin: 10,
      image: null
    },
    {
      userId: 1,
      addressId: 5,
      start: "2024-03-23T10:00:00.000Z",
      end: "2024-03-23T17:00:00.000Z",
      title: "Evenement CATEGORY_1e",
      description: "Apprenez à réaliser de délicieux desserts printaniers !",
      category: "CATEGORY_1",
      participantsMin: 10,
      image: null
    }
  ],
  groupUsers: [
    {
      groupId: 1,
      userId: 1,
    },
    {
      groupId: 1,
      userId: 2,
    },
    {
      groupId: 1,
      userId: 3,
    },
    {
      groupId: 1,
      userId: 4,
    },
    {
      groupId: 1,
      userId: 5,
    }
  ],
  participants: [
    {
      eventId: 1,
      userId: 1
    },
    {
      eventId: 1,
      userId: 2
    },
    {
      eventId: 1,
      userId: 3
    },
    {
      eventId: 1,
      userId: 4
    },
    {
      eventId: 2,
      userId: 3
    },
    {
      eventId: 2,
      userId: 4
    },
    {
      eventId: 2,
      userId: 2
    },
    {
      eventId: 3,
      userId: 3
    },
    {
      eventId: 3,
      userId: 5
    },
    {
      eventId: 3,
      userId: 4
    },
    {
      eventId: 4,
      userId: 3
    },
    {
      eventId: 4,
      userId: 2
    }
  ],

  issues: [
    {
      userId_Modo: 10,
      userId_ModoResp: 15,
      serviceId: 2,
      description: "Problème de connexion internet",
      date: "2024-11-19T00:00:00.000Z",
      status: "pending",
      createdAt: "2024-11-20T00:00:00.000Z",
      updatedAt: "2024-11-20T00:00:00.000Z"
    },
    {
      userId_Modo: 5,
      userId_ModoResp: 12,
      serviceId: 1,
      description: "Imprimante disfonctionnelle",
      date: "2024-11-21T00:00:00.000Z",
      status: "solved",
      createdAt: "2024-11-21T00:00:00.000Z",
      updatedAt: "2024-11-25T00:00:00.000Z"
    }
  ],
  surveys: [
    {
      userId: 1,
      title: "Mon premier sondage",
      description: "Ceci est mon tout premier sondage créé. J'espère qu'il vous plaira !",
      category: "Loisirs",
      createdAt: "2024-12-01T09:17:00.000Z",
      updatedAt: "2024-12-01T09:17:00.000Z"
    },
    {
      userId: 4,
      title: "Sondage sur la satisfaction client",
      description: "Nous aimerions avoir votre avis sur votre récente expérience avec notre entreprise. Merci de votre participation !",
      category: "Entreprise",
      createdAt: "2024-12-01T09:17:00.000Z",
      updatedAt: "2024-12-01T09:17:00.000Z"
    },
    {
      userId: 5,
      title: "Quel est votre restaurant préféré ?",
      description: "Aidez-nous à choisir le meilleur restaurant pour notre prochaine sortie d'équipe. Votez !",
      category: "Restauration",
      createdAt: "2024-12-01T09:17:00.000Z",
      updatedAt: "2024-12-01T09:17:00.000Z"
    },
    {
      userId: 2,
      title: "êtes-vous satisfait des transports publics ?",
      description: "Nous menons une enquête pour améliorer le réseau de transports en commun. Votre avis compte !",
      category: "Services publics",
      createdAt: "2024-12-01T09:17:00.000Z",
      updatedAt: "2024-12-01T09:17:00.000Z"
    },
    {
      userId: 3,
      title: "Quelle est votre destination de voyage idéale ?",
      description: "Partagez vos rêves d'évasion en répondant à ce sondage. Inspirez-nous !",
      category: "Voyage",
      createdAt: "2024-12-01T09:17:00.000Z",
      updatedAt: "2024-12-01T09:17:00.000Z"
    }
  ],
  pools: [
    {
      userId: 123,
      userIdBenef: 456,
      title: "Super piscine",
      description: "Une piscine géniale pour se rafraîchir entre amis",
      createdAt: "2024-12-01T09:19:00.000Z",
      updatedAt: null
    },
    {
      id: 2,
      userId: 789,
      userIdBenef: 101,
      title: "Coin détente",
      description: "Un espace de relaxation avec une belle piscine",
      createdAt: "2024-12-01T09:19:00.000Z",
      updatedAt: null
    },
    {
      id: 3,
      userId: 345,
      userIdBenef: 678,
      title: "Pool party",
      description: "Une piscine idéale pour organiser des fêtes entre amis",
      createdAt: "2024-12-01T09:19:00.000Z",
      updatedAt: null
    },
    {
      id: 4,
      userId: 901,
      userIdBenef: 234,
      title: "Espace aquatique",
      description: "Un endroit parfait pour se baigner et se divertir",
      createdAt: "2024-12-01T09:19:00.000Z",
      updatedAt: null
    },
    {
      id: 5,
      userId: 567,
      userIdBenef: 890,
      title: "Moment de détente",
      description: "Profitez d'un moment de relaxation au bord de la piscine",
      createdAt: "2024-12-01T09:19:00.000Z",
      updatedAt: null
    }
  ],
  posts: [
    {
      id: 1,
      userId: 1,
      title: "Superbe journée à Marseille",
      description: "J'ai passé une journée incroyable à Marseille. J'ai visité le Vieux-Port, Notre-Dame de la Garde et la plage des Catalans. La ville est magnifique et les gens sont très sympathiques.",
      category: "Voyage",
      image: "https://www.cestee.fr/images/32/95/73295-1840w.webp",
      share: ["phone", "email"],
      createdAt: "2024-12-01T09:21:00.000Z",
      updatedAt: "2024-12-01T09:21:00.000Z"
    },
    {
      id: 2,
      userId: 2,
      title: "Recette de bouillabaisse traditionnelle",
      description: "Voici une recette traditionnelle de bouillabaisse, une soupe de poissons provençale. C'est un plat délicieux et réconfortant, parfait pour les jours d'hiver.",
      category: "Cuisine",
      image: "https://lacuisinedegeraldine.fr/wp-content/uploads/2023/07/Bouillabaisse-113.jpg",
      share: ["email"],
      createdAt: "2024-12-01T09:21:00.000Z",
      updatedAt: "2024-12-01T09:21:00.000Z"
    },
    {
      id: 3,
      userId: 3,
      title: "Les meilleurs endroits pour randonner dans les Calanques",
      description: "Les Calanques sont un parc national situé près de Marseille. C'est un endroit magnifique avec des falaises calcaires, des criques et des eaux turquoise. Voici quelques-uns des meilleurs endroits pour randonner dans les Calanques.",
      category: "Sport",
      image: "https://i-de.unimedias.fr/2023/12/07/def-189-calanques-cmoirenc117610-6571e657e00ed.jpg",
      share: ["phone", "email"],
      createdAt: "2024-12-01T09:21:00.000Z",
      updatedAt: "2024-12-01T09:21:00.000Z"
    },
    {
      id: 4,
      userId: 4,
      title: "Événements culturels à Marseille en décembre",
      description: "Il y a de nombreux événements culturels à Marseille en décembre. Vous pouvez visiter les marchés de Noël, assister à des concerts et des spectacles, ou visiter les musées de la ville.",
      category: "Sorties",
      image: null,
      share: ["phone"],
      createdAt: "2024-12-01T09:21:00.000Z",
      updatedAt: "2024-12-01T09:21:00.000Z"
    },
    {
      id: 5,
      userId: 5,
      title: "Mes restaurants préférés à Marseille",
      description: "Marseille a une scène culinaire incroyable. Voici quelques-uns de mes restaurants préférés dans la ville, où vous pourrez déguster des plats provençaux traditionnels et une cuisine internationale.",
      category: "Restaurants",
      image: "https://media.timeout.com/images/106132470/750/562/image.jpg",
      share: ["email"],
      createdAt: "2024-12-01T09:21:00.000Z",
      updatedAt: "2024-12-01T09:21:00.000Z"
    }
  ],
  likes: [
    {
      userId: 1,
      postId: 1,
      createdAt: "2024-12-01T09:36:00.000Z",
      updatedAt: "2024-12-01T09:36:00.000Z"
    },
    {
      userId: 2,
      postId: 2,
      createdAt: "2024-12-01T09:36:00.000Z",
      updatedAt: "2024-12-01T09:36:00.000Z"
    },
    {
      userId: 3,
      postId: 3,
      createdAt: "2024-12-01T09:36:00.000Z",
      updatedAt: "2024-12-01T09:36:00.000Z"
    },
    {
      userId: 4,
      postId: 4,
      createdAt: "2024-12-01T09:36:00.000Z",
      updatedAt: "2024-12-01T09:36:00.000Z"
    },
    {
      userId: 5,
      postId: 5,
      createdAt: "2024-12-01T09:36:00.000Z",
      updatedAt: "2024-12-01T09:36:00.000Z"
    }
  ],
  flags: [
    {
      targetId: 1,
      userId: 1,
      reason: "haineux",
      type: "event",
      active: true,
      createdAt: "2024-11-22T13:37:20Z",
      updatedAt: ""
    },
    {
      targetId: 1,
      userId: 2,
      reason: "irrespecteux",
      type: "survey",
      active: true,
      createdAt: "2024-04-15T09:12:45Z",
      updatedAt: ""
    },
    {
      targetId: 1,
      userId: 1,
      reason: "dangereux",
      type: "service",
      active: true,
      createdAt: "2024-07-08T18:23:59Z",
      updatedAt: ""
    },
    {
      targetId: 1,
      userId: 1,
      reason: "illicite",
      type: "survey",
      active: true,
      createdAt: "2024-02-29T02:46:11Z",
      updatedAt: ""
    },
    {
      targetId: 2,
      userId: 4,
      reason: "illicite",
      type: "post",
      active: true,
      createdAt: "2024-12-25T19:54:32Z",
      updatedAt: ""
    },
    {
      targetId: 2,
      userId: 3,
      reason: "irrespecteux",
      type: "event",
      active: true,
      createdAt: "2024-01-17T11:07:58Z",
      updatedAt: ""
    },
    {
      targetId: 2,
      userId: 6,
      reason: "dangereux",
      type: "pool",
      active: true,
      createdAt: "2024-09-03T05:32:14Z",
      updatedAt: ""
    },
    {
      targetId: 3,
      userId: 6,
      reason: "illicite",
      type: "service",
      active: true,
      createdAt: "2024-05-21T16:49:47Z",
      updatedAt: ""
    },
    {
      targetId: 3,
      userId: 5,
      reason: "haineux",
      type: "survey",
      active: true,
      createdAt: "2024-06-12T22:10:35Z",
      updatedAt: ""
    },
    {
      targetId: 3,
      userId: 4,
      reason: "irrespecteux",
      type: "post",
      active: true,
      createdAt: "2024-03-09T08:43:27Z",
      updatedAt: ""
    },
    {
      targetId: 4,
      userId: 1,
      reason: "dangereux",
      type: "event",
      active: true,
      createdAt: "2024-10-28T14:56:19Z",
      updatedAt: ""
    },
    {
      targetId: 4,
      userId: 3,
      reason: "illicite",
      type: "pool",
      active: true,
      createdAt: "2024-08-19T00:25:01Z",
      updatedAt: ""
    }
  ],
}

const services: CreateServiceDto[] = [
  {
    userId: 1,
    userIdResp: 1,
    type: 'GET',
    title: "jardinage",
    description: "Besoin d'aide pour entretenir votre jardin ?",
    category: "CATEGORY_1",
    skill: "SKILL_3",
    hard: "HARD_0",
    status: "ISSUE"
  },
  {
    userId: 3,
    userIdResp: 1,
    type: "DO",
    title: "Montage de meubles",
    description: "Je peux vous aider à monter vos nouveaux meubles !",
    category: "CATEGORY_2",
    skill: "SKILL_1",
    hard: "HARD_0",
    image: null,
    status: "RESP"
  },
  {
    userId: 5,
    userIdResp: 0,
    type: "GET",
    title: "Cours de guitare",
    description: "Vous souhaitez apprendre à jouer de la guitare ?",
    category: "CATEGORY_3",
    skill: "SKILL_0",
    hard: "HARD_3",
    image: "https://www.orchestra-studio.com/site/wp-content/uploads/2020/05/iStock-1056444080-2048x1366.jpg",
    status: "POST"
  },
  {
    userId: 2,
    userIdResp: 3,
    type: "GET",
    title: "Garde d'animaux",
    description: "Je peux garder votre animal de compagnie pendant votre absence.",
    category: "CATEGORY_4",
    skill: "SKILL_1",
    hard: "HARD_2",
    image: "https://www.lesrecettesdedaniel.fr/modules/hiblog/views/img/upload/original/488818546d009ef951fa45b42f404daa.jpg",
    status: "ISSUE"
  },
  {
    userId: 4,
    userIdResp: 3,
    type: "DO",
    title: "Développement d'un site web",
    description: "Je peux vous aider à développer votre site web.",
    category: "CATEGORY_3",
    skill: "SKILL_1",
    hard: "HARD_1",
    image: null,
    status: "RESP"
  }
]



const seed = async () => {

  for (const data of Data.address) {
    await prisma.address.deleteMany({ where: { address: data.address } });
    await prisma.address.create({ data })
  }
  for (const data of Data.groups) {
    await prisma.group.deleteMany({ where: { name: data.name } });
    await prisma.group.create({ data })
  }
  for (const data of Data.users) {
    await prisma.user.deleteMany({ where: { email: data.email } });
    data.password = await bcrypt.hash(data.password, roundsOfHashing);
    //    await prisma.user.update({ where: { email: data.email }, data });
    { await prisma.user.create({ data }) }
  }
  for (const data of Data.profiles) {
    await prisma.profile.deleteMany({ where: { userId: data.userId } });
    const { userId, addressId, userIdSp, ...profile } = data
    await prisma.profile.create({ data: { ...profile, User: { connect: { id: userId } }, UserSp: { connect: { id: userId } }, Address: { connect: { id: addressId } } } })
  }
  for (const data of Data.groupUsers) {
    await prisma.groupUser.deleteMany({ where: { userId: data.userId } });
    await prisma.groupUser.create({ data })
  }
  for (const data of Data.events) {
    await prisma.event.deleteMany({ where: { title: data.title } });
    await prisma.event.create({ data })
  }
  for (const data of Data.participants) {
    await prisma.participant.deleteMany({ where: { userId: data.userId, eventId: data.eventId } });
    await prisma.participant.create({ data })
  }
  for (const data of services) {
    await prisma.service.deleteMany({ where: { title: data.title } });
    const { userId, userIdResp, ...service } = data
    await prisma.service.create({ data: { ...service, UserService: { connect: { id: userId } }, UserServiceResp: { connect: { id: userIdResp } } } })
  }
  // for (const data of Data.issues) {
  //   await prisma.issue.deleteMany({ where: { serviceId: data.serviceId } });
  //   await prisma.issue.create({ data })
  // }
  // for (const data of Data.surveys) {
  //   await prisma.survey.deleteMany({ where: { userId: data.userId, title: data.title } });
  //   await prisma.survey.create({ data })
  // }
}


seed();