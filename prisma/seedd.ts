import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    email: "utilisateur1@exemple.fr",
    password: "motdepassefort123",
  },
  {
    email: "utilisateur2@exemple.fr",
    password: "motdepassefort456",
  },
  {
    email: "utilisateur3@exemple.fr",
    password: "motdepassefort789",
  },
  {
    email: "utilisateur4@exemple.fr",
    password: "motdepassefort012",
  },
  {
    email: "utilisateur9@exemple.fr",
    password: "motdepassefort345",
  }
    ],
events:[
    {
      userId: 1,
      addressId: 1,
      start: "2024-12-02T00:00:00.000Z",
      end: "2024-12-20T00:00:00.000Z",
      title: "Soirée jeux de société",
      description: "Venez passer une soirée conviviale autour de jeux de société !",
      category: "CATEGORY_1" ,
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
      category: "CATEGORY_1" ,
      participantsMin: 6,
      image: "https://www.very-utile.com/scripts/files/6699a4032add49.55400648/fete-noel.jpg"},
    {
      userId: 3,
      addressId: 3,
      start: "2024-01-21T14:00:00.000Z",
      end: "2024-01-21T18:00:00.000Z",
      title: "Randonnée pédestre dans les calanques de Marseille",
      description: "Partez à la découverte des magnifiques calanques de Marseille en randonnée !",
      category: "CATEGORY_1" ,
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
      category: "CATEGORY_1" ,
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
      category: "CATEGORY_1" ,
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
      category: "CATEGORY_1" ,
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
}



const seed = async () => {
  for (const data of Data.address) {await prisma.address.create({data}) }
  for (const data of Data.groups) {await prisma.group.create({data}) }
  for (const data of Data.users) { await prisma.user.create({ data }) }
  for (const data of Data.groupUsers) {await prisma.groupUser.create({ data })}
  for (const data of Data.events) { await prisma.event.create({ data  }) }
}

seed();