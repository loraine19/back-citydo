import { newFaker } from '../../prisma/seed';
import { getRandomPixabayImageUrl } from './seedImage';
import translate from "translate";

translate.engine = 'google';
translate.key = process.env.GOOGLE_API_KEY || '';

// --- ENUMS ---
export enum FakerSubjects {
    EVENT = 'event',
    SERVICE = 'service',
    POST = 'post',
    POOL = 'pool',
    SURVEY = 'survey',
    GROUP = 'group',
    MESSAGE = 'message',
    AUTRE = 'autre',
}

export enum GroupCategory {
    CATEGORY_1 = 'Quartier',
    CATEGORY_2 = 'Copropriété',
    CATEGORY_3 = 'Arrondissement',
    CATEGORY_4 = 'Par activité',
    CATEGORY_5 = 'Autre',
}
export enum EventCategory {
    CATEGORY_1 = 'Sport',
    CATEGORY_2 = 'Social',
    CATEGORY_3 = 'Culturel',
    CATEGORY_4 = 'Musique',
    CATEGORY_5 = 'Autre',
}
export enum ServiceCategory {
    CATEGORY_1 = 'Bricolage et entretien',
    CATEGORY_2 = 'Cours et formation',
    CATEGORY_3 = 'Animaux',
    CATEGORY_4 = 'Enfants',
    CATEGORY_5 = 'Autre',
}
export enum PostCategory {
    CATEGORY_1 = "Perdu-Trouvé",
    CATEGORY_2 = "Animaux",
    CATEGORY_3 = "À vendre",
    CATEGORY_4 = "Je donne",
    CATEGORY_5 = "Autre",
}
export enum SurveyCategory {
    CATEGORY_1 = 'Règles de quartier',
    CATEGORY_2 = 'Projet de travaux',
    CATEGORY_3 = 'Partage d\'opinion',
    CATEGORY_4 = 'Organisation d\'événement',
    CATEGORY_5 = 'Autre projet',
}

// --- INTERFACES POUR DONNÉES STRUCTURÉES ---
interface ElementSpecifique {
    nom: string;
    adjectif?: string[]
    verbe?: string[];
    verbeJe?: string[];
    detailsSpecifiques?: string[];
}

export interface ContentOptions {
    auteur?: string;
    ville?: string;
    date?: string;
}

// --- DATA ---
const titleWordsByKey = {
    event: ['Invitation à un événement', 'Participez à notre initiative', 'Nouveau rendez-vous', 'Annonce spéciale quartier', 'Ne manquez pas', 'Découvrez bientôt'],
    service: ['Proposition de service', 'Besoin d\'un coup de main', 'Service', 'Entraide', 'Offre spéciale service', 'Besoin d\'un service'],
    post: ['Annonce', 'Nouveaux', 'Objet à signaler', 'Information de voisinage', 'Bon à savoir', 'Infos', 'Nouvelle offre', 'partage'],
    pool: ['Appel à la solidarité', 'Soutien', 'Cagnotte', 'Ensemble pour une cause', 'Aider', 'Contribuez', 'Participez à la cagnotte', 'Votez'],
    survey: ['Votre avis nous intéresse', 'Participez à notre consultation', 'Sondage important', 'Exprimez-vous', 'Donnez votre opinion', 'Votez'],
    group: ['Communauté', 'Groupe', 'Ensemble', 'Collectif en action', 'Participez à la vie locale', 'Équipe'],
    autre: ['Information diverse', 'Message pour la communauté', 'Communication importante', 'À noter dans le quartier',],
}

const linkWords = ['et', 'ou', 'mais', 'donc', 'ni', 'car', 'aussi', 'alors', 'ainsi', 'cependant', 'pourtant', 'toutefois', 'néanmoins', 'en effet', 'quand', 'lorsque', 'comme', 'si', 'puisque', 'parce que', 'afin de', 'pour que', 'afin que', 'bien que', 'pendant que', 'à', 'de', 'en', 'pour', 'par', 'sur', 'sous', 'avec', 'sans', 'chez', 'vers', 'dans', 'concernant', 'autour de', 'malgré', 'par exemple', 'c\'est-à-dire', 'notamment', 'surtout', 'également', 'non seulement', 'mais aussi', 'au sein de']

// --- ÉLÉMENTS SPÉCIFIQUES PAR CATÉGORIE ---
// ÉVÉNEMENTS
const eventElementsByCategory: Record<EventCategory, ElementSpecifique[]> = {
    [EventCategory.CATEGORY_1]: [ // Sport
        {
            nom: 'match de foot',
            adjectif: ['amical', 'enfants', 'en salle', 'régional'],
            verbe: ['nous organisons un', 'nous lançons un', 'nous proposons un'],
            verbeJe: ['j\'organise un', 'je lance un', 'je propose un'],
            detailsSpecifiques: ['sur le terrain municipal', 'ouvert à tous les niveaux de jeu', 'équipes à former sur place, dans la bonne humeur']
        },
        {
            nom: 'course à pied',
            adjectif: ['conviviale', 'sportive', 'ouverte à tous'],
            verbe: ['nous lançons une', 'nous organisons une', 'nous proposons une'],
            verbeJe: ['je lance une', 'j\'organise une', 'je propose une'],
            detailsSpecifiques: ['parcours de 5km en boucle dans le parc', 'ravitaillement en eau prévu à mi-parcours', 'pour coureurs débutants et confirmés']
        },
        {
            nom: 'séance de yoga',
            adjectif: ['en plein air', 'détente', 'matinale'],
            verbe: ['nous proposons une', 'nous organisons une', 'nous lançons une'],
            verbeJe: ['je propose une', 'j\'organise une', 'je lance une'],
            detailsSpecifiques: ['au lever du soleil, dans un cadre verdoyant du parc', 'apportez votre tapis et une tenue confortable', 'moment de détente et de bien-être assuré']
        },
        {
            nom: 'tournoi de pétanque',
            adjectif: ['amical', 'local', 'festif'],
            verbe: ['nous mettons en place un', 'nous organisons un', 'nous lançons un'],
            verbeJe: ['je mets en place un', 'j\'organise un', 'je lance un'],
            detailsSpecifiques: ['au boulodrome municipal ombragé', 'inscriptions par doublette ou triplette', 'ambiance garantie, buvette sur place']
        },
        {
            nom: 'randonnée découverte',
            adjectif: ['nature', 'familiale', 'guidée'],
            verbe: ['nous organisons une', 'nous lançons une', 'nous proposons une'],
            verbeJe: ['j\'organise une', 'je lance une', 'je propose une'],
            detailsSpecifiques: ['sur les sentiers forestiers environnants (environ 8km)', 'prévoir bonnes chaussures, eau et petit encas', 'niveau facile à moyen, encadrée par un animateur']
        },
        {
            nom: 'initiation tennis',
            adjectif: ['débutant', 'sportive', 'gratuite'],
            verbe: ['nous proposons une', 'nous lançons une', 'nous organisons une'],
            verbeJe: ['je propose une', 'j\'organise une', 'je lance une'],
            detailsSpecifiques: ['sur les courts municipaux en accès libre', 'prêt de raquettes et balles possible (stock limité)', 'séance découverte encadrée par un bénévole']
        },
        {
            nom: 'atelier stretching',
            adjectif: ['relaxant', 'collectif', 'accessible'],
            verbe: ['nous lançons un', 'nous proposons un', 'nous organisons un'],
            verbeJe: ['je lance un', 'je propose un', 'j\'organise un'],
            detailsSpecifiques: ['pour tous niveaux, idéal après l\'effort ou pour se détendre', 'en extérieur par beau temps, sinon dans une salle couverte', 'apportez une serviette et une bouteille d\'eau']
        },
        {
            nom: 'balade à vélo',
            adjectif: ['familiale', 'sécurisée', 'pittoresque'],
            verbe: ['nous organisons une', 'nous proposons une', 'participez à notre'],
            verbeJe: ['j\'organise une', 'je propose une', 'participez à ma'],
            detailsSpecifiques: ['parcours familial adapté (environ 10-15km)', 'sécurité : casque et gilet fluo fortement recommandés', 'rendez-vous au grand chêne du parc, départ en matinée']
        },
        {
            nom: 'tournoi de',
            adjectif: ['foot urbain', 'basket convivial', 'petanque dynamique'],
            verbe: ['nous lançons un', 'nous organisons un', 'inscrivez-vous au'],
            verbeJe: ['je lance un', 'j\'organise un', 'inscrivez-vous à mon'],
            detailsSpecifiques: ['sur le city stade du quartier des Oliviers', 'équipes de 3 ou 4 joueurs, mixtes bienvenues', 'inscription gratuite sur place, petits lots pour les vainqueurs']
        }
    ],
    [EventCategory.CATEGORY_2]: [ // Social
        {
            nom: 'apéro des voisins',
            adjectif: ['convivial', 'partagé', 'informel'],
            verbeJe: ['j\'organise l\'', 'je lance l\'', 'je propose l\''],
            verbe: ['nous organisons l\'', 'nous lançons l\'', 'nous proposons l\''],
            detailsSpecifiques: ['chacun apporte quelque chose à boire ou à grignoter', 'pour mieux se connaître et échanger simplement', 'devant la résidence "Les Mimosas" ou au parc voisin']
        },
        {
            nom: 'pique-nique',
            adjectif: ['participatif', 'familial', 'en plein air'],
            verbe: ['nous proposons un', 'nous lançons un', 'nous organisons un'],
            verbeJe: ['je propose un', 'je lance un', 'j\'organise un'],
            detailsSpecifiques: ['au parc central de la ville, près du lac', 'apportez votre nappe, panier repas et votre bonne humeur', 'jeux pour enfants et musique d\'ambiance bienvenus']
        },
        {
            nom: 'soirée jeux de société',
            adjectif: ['ludique', 'intergénérationnelle', 'conviviale'],
            verbe: ['nous animons une', 'nous organisons une', 'nous lançons une'],
            verbeJe: ['j\'anime une', 'j\'organise une', 'je lance une'],
            detailsSpecifiques: ['à la salle commune municipale ou dans un café partenaire', 'apportez vos jeux préférés, tous les âges sont conviés', 'boissons et grignotages sur place (participation libre appréciée)']
        },
        {
            nom: 'atelier cuisine du monde',
            adjectif: ['partagé', 'créatif', 'gourmand'],
            verbe: ['nous lançons un', 'nous proposons un', 'nous organisons un'],
            verbeJe: ['je lance un', 'je propose un', 'j\'organise un'],
            detailsSpecifiques: ['thème : "Saveurs d\'Italie" pour cette session', 'inscription nécessaire (places limitées pour le confort)', 'on cuisine ensemble puis on déguste nos préparations']
        },
        {
            nom: 'fête de quartier',
            adjectif: ['festive', 'locale', 'annuelle'],
            verbe: ['nous préparons la', 'nous organisons la', 'nous lançons la'],
            verbeJe: ['je prépare la', 'j\'organise la', 'je lance la'],
            detailsSpecifiques: ['musique live, stands associatifs, animations pour enfants', 'pour célébrer le vivre-ensemble et la convivialité locale', 'sur la place du marché rénovée, toute la journée']
        },
        {
            nom: 'brunch',
            adjectif: ['matinal', 'gourmand', 'détendu'],
            verbe: ['nous lançons un', 'nous proposons un', 'nous organisons un'],
            verbeJe: ['je lance un', 'je propose un', 'j\'organise un'],
            detailsSpecifiques: ['chacun apporte un plat sucré ou salé à partager avec les autres', 'moment convivial pour bien commencer la journée du dimanche', 'au parc des Acacias ou à la salle polyvalente si mauvais temps']
        },
        {
            nom: 'atelier décoration',
            adjectif: ['créatif', 'participatif', 'thématique'],
            verbe: ['nous proposons un', 'nous lançons un', 'nous organisons un'],
            verbeJe: ['je propose un', 'je lance un', 'j\'organise un'],
            detailsSpecifiques: ['pour préparer les décorations de la saison (ex: Noël, printemps)', 'matériel de base fourni par l\'association, apportez vos idées !', 'ouvert à tous, enfants accompagnés d\'un adulte bienvenus']
        },
        {
            nom: 'goûter',
            adjectif: ['convivial', 'simple', 'chaleureux'],
            verbe: ['nous organisons un', 'nous proposons un', 'participez à notre'],
            verbeJe: ['j\'organise un', 'je propose un', 'participez à mon'],
            detailsSpecifiques: ['chacun amène gâteaux faits maison, boissons ou fruits de saison', 'dans le jardin de la résidence "Le Clos Fleuri" ou la salle commune', 'pour un après-midi de détente, d\'échanges et de sourires']
        },
        {
            nom: 'Brocante',
            adjectif: ['solidaire', 'locale', 'économique'],
            verbe: ['nous mettons en place une', 'nous organisons une', 'participez à la'],
            verbeJe: ['je mets en place une', 'j\'organise une', 'participez à ma'],
            detailsSpecifiques: ['dépôt des articles en bon état le samedi matin, vente l\'après-midi', 'à la salle des fêtes municipale du centre-ville', 'une seconde vie pour les affaires, des bonnes affaires pour tous']
        }
    ],
    [EventCategory.CATEGORY_3]: [ // Culturel
        {
            nom: 'exposition de peintures',
            adjectif: ['artistique', 'gratuite', 'variée'],
            verbe: ['nous accueillons une', 'nous organisons une', 'nous lançons une'],
            verbeJe: ['j\'accueille une', 'j\'organise une', 'je lance une'],
            detailsSpecifiques: ['artistes du quartier et des environs à l\'honneur ce mois-ci', 'vernissage en début de mois, en présence des artistes', 'entrée libre à la galerie municipale ou à la salle d\'exposition principale']
        },
        {
            nom: 'atelier d\'écriture',
            adjectif: ['littéraire', 'inspirant', 'participatif'],
            verbe: ['nous animons un', 'nous proposons un', 'nous lançons un'],
            verbeJe: ['j\'anime un', 'je propose un', 'je lance un'],
            detailsSpecifiques: ['pour adultes et adolescents (à partir de 15 ans)', 'thème : "Souvenirs d\'enfance" ou écriture libre selon l\'inspiration', 'à la bibliothèque municipale, sur inscription préalable']
        },
        {
            nom: 'visite guidée du patrimoine',
            adjectif: ['historique', 'locale', 'commentée'],
            verbe: ['nous proposons une', 'nous lançons une', 'nous organisons une'],
            verbeJe: ['je propose une', 'je lance une', 'j\'organise une'],
            detailsSpecifiques: ['des lieux emblématiques et méconnus du centre historique', 'découverte de l\'histoire et des anecdotes locales avec un guide passionné', 'inscription recommandée, places limitées, départ devant l\'Office de Tourisme']
        },
        {
            nom: 'projection de film en plein-air',
            adjectif: ['estivale', 'familiale', 'gratuite'],
            verbe: ['nous organisons une', 'nous proposons une', 'assistez à notre'],
            verbeJe: ['j\'organise une', 'je propose une', 'assistez à ma'],
            detailsSpecifiques: ['projection d\'un film d\'animation grand public récent', 'au parc de la Citadelle à la tombée de la nuit (vers 21h en été)', 'apportez couvertures, chaises pliantes et votre pique-nique !']
        },
        {
            nom: 'café philosophique',
            adjectif: ['participatif', 'réflexif', 'ouvert à tous'],
            verbe: ['nous lançons un', 'nous animons un', 'participez à notre'],
            verbeJe: ['je lance un', 'j\'anime un', 'participez à mon'],
            detailsSpecifiques: ['thème du jour : "Le bonheur est-il un objectif ou un chemin ?"', 'au café "Le Penseur" ou à la médiathèque centrale', 'débat animé par un modérateur, dans le respect et l\'écoute mutuelle']
        }
    ],
    [EventCategory.CATEGORY_4]: [ // Musique
        {
            nom: 'concert acoustique',
            adjectif: ['intimiste', 'local', 'gratuit'],
            verbe: ['nous organisons un', 'nous proposons un', 'venez écouter notre'],
            verbeJe: ['j\'organise un', 'je propose un', 'venez écouter mon'],
            detailsSpecifiques: ['artistes locaux en duo ou trio (guitare, voix, percussions)', 'dans le jardin de la bibliothèque ou un lieu chaleureux du centre', 'ambiance détendue, participation au chapeau pour les artistes']
        },
        {
            nom: 'scène musicale',
            adjectif: ['participative', 'improvisée', 'éclectique'],
            verbe: ['nous lançons une', 'nous animons une', 'participez à notre'],
            verbeJe: ['je lance une', 'j\'anime une', 'participez à ma'],
            detailsSpecifiques: ['ouverte à tous les musiciens et chanteurs, tous niveaux et styles', 'matériel de base (sono, micros, amplis) sur place, apportez vos instruments', 'au bar associatif "Le Tremplin Sonore" ou à la salle municipale des fêtes']
        },
        {
            nom: 'chorale éphémère',
            adjectif: ['participative', 'joyeuse', 'ouverte à tous'],
            verbe: ['nous créons une', 'nous vous invitons à rejoindre notre', 'chantez avec notre'],
            verbeJe: ['je crée une', 'je vous invite à rejoindre ma', 'chantez avec ma'],
            detailsSpecifiques: ['apprentissage de chants populaires français et internationaux', 'aucune connaissance musicale préalable n\'est requise, juste l\'envie', 'répétitions à la Maison Pour Tous, petite restitution publique en fin de cycle']
        },
        {
            nom: 'blind test géant',
            adjectif: ['ludique', 'musical', 'par équipes'],
            verbe: ['nous organisons un', 'nous vous convions à un', 'testez vos connaissances lors de notre'],
            verbeJe: ['j\'organise un', 'je vous convie à un', 'testez vos connaissances lors de mon'],
            detailsSpecifiques: ['équipes de 4 à 6 personnes à former sur place ou en amont', 'tous styles musicaux, des classiques des années 60 aux hits actuels', 'à la salle des fêtes centrale, nombreux lots pour les équipes gagnantes']
        }
    ],
    [EventCategory.CATEGORY_5]: [ // Autre
        {
            nom: 'vide-grenier annuel',
            adjectif: ['local', 'convivial', 'participatif'],
            verbe: ['nous organisons notre', 'nous lançons les inscriptions pour le', 'participez au'],
            verbeJe: ['j\'organise mon', 'je lance les inscriptions pour mon', 'participez à mon'],
            detailsSpecifiques: ['sur la place du marché ou dans les rues piétonnes du centre-ville', 'inscriptions pour les exposants en mairie (tarif modique par emplacement)', 'buvette et petite restauration sur place par l\'association des commerçants']
        },
        {
            nom: 'marché de Noël artisanal',
            adjectif: ['festif', 'local', 'créatif'],
            verbe: ['nous préparons le', 'nous organisons le', 'exposez vos créations à notre'],
            verbeJe: ['je prépare mon', 'j\'organise mon', 'exposez vos créations à mon'],
            detailsSpecifiques: ['artisans et créateurs de la région exclusivement sélectionnés', 'idées cadeaux originales, vin chaud, crêpes et autres gourmandises de saison', 'sur la place de la Mairie, durant les deux week-ends précédant Noël']
        },
        {
            nom: 'nettoyage de printemps',
            adjectif: ['écologique', 'participatif', 'utile'],
            verbe: ['nous organisons un', 'nous vous invitons à un', 'participons ensemble au'],
            verbeJe: ['j\'organise un', 'je vous invite à un', 'participez avec moi au'],
            detailsSpecifiques: ['nettoyage des parcs publics, berges de la rivière et rues principales du quartier', 'matériel (gants, sacs) fourni par la municipalité, prévoir une tenue adaptée', 'rendez-vous devant la mairie à 9h, pot de l\'amitié offert à tous les participants à midi']
        },
        {
            nom: 'concours de déguisements',
            adjectif: ['festif', 'familial', 'créatif'],
            verbe: ['nous lançons un', 'nous organisons un', 'participez à notre'],
            verbeJe: ['je lance un', 'j\'organise un', 'participez à mon'],
            detailsSpecifiques: ['thème : "Personnages de contes et légendes" ou thème libre', 'catégories enfants et adultes, jury et prix pour les costumes les plus originaux', 'défilé en musique et remise des prix sur la place de la Fontaine']
        }
    ]
};

// SERVICES
const serviceElementsByCategory: Record<ServiceCategory, ElementSpecifique[]> = {
    [ServiceCategory.CATEGORY_1]: [
        {
            nom: 'bricolage',
            adjectif: ['domestique', 'rapide', 'efficace'],
            verbe: ['je propose mes services pour', 'j\'effectue des travaux de', 'je réalise du'],
            detailsSpecifiques: ['montage de meubles, pose d\'étagères', 'petites réparations diverses', 'outillage de base fourni']
        },
        {
            nom: 'entretien de jardin',
            adjectif: ['régulier', 'soigné', 'saisonnier'],
            verbe: ['je peux vous aider pour', 'j\'entretiens votre', 'je m\'occupe de votre'],
            detailsSpecifiques: ['tonte de pelouse, taille de haies', 'désherbage, petits travaux paysagers', 'disponible les week-ends']
        },
        {
            nom: 'aide au déménagement',
            adjectif: ['ponctuelle', 'efficace', 'organisée'],
            verbe: ['j\'offre mes bras pour', 'je facilite votre', 'j\'aide à transporter pour'],
            detailsSpecifiques: ['porter des cartons, charger un véhicule', 'ponctuellement et sur demande', 'dans la bonne humeur']
        },
        {
            nom: 'montage de meubles',
            adjectif: ['neufs', 'en kit', 'soigné'],
            verbe: ['j\'assemble vos', 'je monte vos', 'j\'installe vos'],
            detailsSpecifiques: ['tous types de meubles (IKEA, Conforama, etc.)', 'avec ou sans notice', 'outillage professionnel fourni']
        },
        {
            nom: 'petites réparations',
            adjectif: ['domestiques', 'simples', 'sécurisées'],
            verbe: ['je répare vos', 'je change vos', 'j\'interviens sur vos'],
            detailsSpecifiques: ['changement d\'ampoules, de prises', 'réparation de luminaires simples', 'vérification de petits dysfonctionnements']
        }
    ],
    [ServiceCategory.CATEGORY_2]: [
        {
            nom: 'soutien scolaire',
            adjectif: ['personnalisé', 'pédagogique', 'adapté'],
            verbe: ['je donne des cours de', 'j\'accompagne en', 'je propose du'],
            detailsSpecifiques: ['maths, français, anglais (niveau collège/lycée)', 'pédagogie adaptée à chaque élève', 'à mon domicile ou chez vous']
        },
        {
            nom: 'initiation à l\'informatique',
            adjectif: ['progressive', 'claire', 'pratique'],
            verbe: ['je propose une', 'j\'initie à', 'je forme sur'],
            detailsSpecifiques: ['pour seniors ou grands débutants', 'navigation internet, email, bureautique de base', 'patience et clarté garanties']
        },
        {
            nom: 'cours de guitare',
            adjectif: ['débutant', 'ludique', 'progressif'],
            verbe: ['j\'enseigne la', 'j\'initie à la', 'je donne des'],
            detailsSpecifiques: ['méthode simple et ludique', 'premiers accords, rythmiques de base', 'prêt d\'instrument possible pour la première séance']
        },
        {
            nom: 'ateliers de langue français',
            adjectif: ['conviviaux', 'pratiques', 'thématiques'],
            verbe: ['j\'anime des', 'j\'organise des', 'je facilite des'],
            detailsSpecifiques: ['pour non-francophones (FLE)', 'améliorer l\'aisance à l\'oral', 'petits groupes, thèmes variés']
        },
        {
            nom: 'aide à la création de CV',
            adjectif: ['moderne', 'percutant', 'professionnel'],
            verbe: ['j\'aide à rédiger votre', 'je conseille pour votre', 'j\'optimise votre'],
            detailsSpecifiques: ['mise en page, formulation', 'valorisation des compétences et expériences', 'adapté au secteur visé']
        }
    ],
    [ServiceCategory.CATEGORY_3]: [
        {
            nom: 'garde de chat à domicile',
            adjectif: ['attentionnée', 'fiable', 'régulière'],
            verbe: ['je peux assurer la', 'je veille sur votre', 'je m\'occupe de votre'],
            detailsSpecifiques: ['pendant vos vacances ou week-ends', 'visites, nourriture, câlins', 'personne de confiance et amie des animaux']
        },
        {
            nom: 'promenades de chien',
            adjectif: ['régulières', 'dynamiques', 'sécurisées'],
            verbe: ['je suis disponible pour les', 'je promène votre', 'je sors votre'],
            detailsSpecifiques: ['régulièrement ou ponctuellement', 'balades adaptées à ses besoins', 'dans le quartier ou au parc']
        },
        {
            nom: 'pet-sitting pour petits animaux',
            adjectif: ['bienveillant', 'expérimenté', 'adapté'],
            verbe: ['je propose mes services de', 'je garde vos', 'je soigne vos'],
            detailsSpecifiques: ['rongeurs, oiseaux, poissons', 'soins attentifs et respectueux', 'expérience avec diverses espèces']
        },
        {
            nom: 'visites pour rongeurs',
            adjectif: ['quotidiennes', 'attentives', 'douces'],
            verbe: ['je rends visite à vos', 'je nourris vos', 'je nettoie la cage de vos'],
            detailsSpecifiques: ['hamsters, cochons d\'Inde, lapins', 'alimentation, eau fraîche, vérification du bien-être', 'pendant vos absences courtes']
        },
        {
            nom: 'soins aux poissons',
            adjectif: ['hebdomadaires', 'méticuleux', 'adaptés'],
            verbe: ['j\'entretiens votre aquarium de', 'je nourris vos', 'je contrôle l\'eau de vos'],
            detailsSpecifiques: ['nettoyage partiel de l\'aquarium', 'alimentation adaptée', 'vérification du filtre et de la température']
        }
    ],
    [ServiceCategory.CATEGORY_4]: [
        {
            nom: 'baby-sitting',
            adjectif: ['ponctuel', 'fiable', 'expérimenté'],
            verbe: ['je suis disponible pour du', 'je garde vos', 'je surveille vos'],
            detailsSpecifiques: ['en soirée ou le week-end', 'enfants de tout âge', 'expérience et références vérifiables']
        },
        {
            nom: 'aide aux devoirs',
            adjectif: ['scolaire', 'patiente', 'structurée'],
            verbe: ['je peux accompagner pour l\'', 'j\'aide votre enfant avec ses', 'je supervise les'],
            detailsSpecifiques: ['niveau primaire et collège', 'méthodologie et encouragement', 'créneaux après l\'école']
        },
        {
            nom: 'accompagnement aux activités extra-scolaires',
            adjectif: ['sécurisé', 'ponctuel', 'fiable'],
            verbe: ['je peux prendre en charge l\'', 'j\'accompagne votre enfant à ses', 'je transporte votre enfant pour ses'],
            detailsSpecifiques: ['trajets école-activité ou domicile-activité', 'personne sérieuse et ponctuelle', 'véhiculée si besoin']
        },
        {
            nom: 'garde d\'enfants périscolaire',
            adjectif: ['matinale', 'après l\'école', 'régulière'],
            verbe: ['je récupère vos enfants pour la', 'j\'accompagne vos enfants pour la', 'je garde vos enfants en'],
            detailsSpecifiques: ['avant ou après les heures d\'école', 'aide au goûter, jeux calmes', 'trajet école-domicile sécurisé']
        },
        {
            nom: 'animation pour goûters d\'anniversaire',
            adjectif: ['ludique', 'créative', 'thématique'],
            verbe: ['j\'anime les', 'j\'organise des jeux pour les', 'je propose des activités pour les'],
            detailsSpecifiques: ['jeux adaptés à l\'âge, petits ateliers', 'thème au choix (super-héros, princesses, etc.)', 'pour enfants de 3 à 10 ans']
        }
    ],
    [ServiceCategory.CATEGORY_5]: [
        {
            nom: 'coup de main',
            adjectif: ['ponctuel', 'polyvalent', 'disponible'],
            verbe: ['je propose un', 'je donne un', 'j\'offre un'],
            detailsSpecifiques: ['pour diverses tâches (courses, paperasse simple)', 'selon mes disponibilités', 'n\'hésitez pas à demander']
        },
        {
            nom: 'partage de compétences',
            adjectif: ['spécifique', 'convivial', 'réciproque'],
            verbe: ['je suis ouvert au', 'je partage mes', 'j\'échange des'],
            detailsSpecifiques: ['en informatique, en cuisine, en couture...', 'échange de savoirs convivial', 'contactez-moi pour discuter']
        },
        {
            nom: 'conseils personnalisés',
            adjectif: ['avisés', 'discrets', 'bienveillants'],
            verbe: ['je peux offrir des', 'je donne des', 'je prodigue des'],
            detailsSpecifiques: ['sur des sujets que je maîtrise bien (à préciser)', 'dans un esprit d\'entraide', 'discrétion assurée']
        },
        {
            nom: 'aide administrative',
            adjectif: ['organisée', 'méthodique', 'confidentielle'],
            verbe: ['j\'aide pour votre', 'je trie votre', 'je classe votre'],
            detailsSpecifiques: ['classement de documents, aide à la rédaction de courriers simples', 'compréhension de formulaires basiques', 'discrétion garantie']
        },
        {
            nom: 'préparation de repas',
            adjectif: ['familiaux', 'sains', 'occasionnels'],
            verbe: ['je prépare des', 'je cuisine des', 'je concocte des'],
            detailsSpecifiques: ['cuisine familiale, plats du quotidien', 'pour une ou plusieurs personnes', 'selon vos goûts et ingrédients fournis']
        }
    ],
};

const postElementsByCategory: Record<PostCategory, ElementSpecifique[]> = {
    [PostCategory.CATEGORY_1]: [
        {
            nom: 'trousseau de clés',
            adjectif: ['avec porte-clés distinctif', 'important', 'métallique'],
            verbe: ['j\'ai perdu mon', 'je recherche activement mon', 'avis de perte pour un'],
            detailsSpecifiques: ['avec un porte-clés en bois', 'secteur [nom de rue/parc]', 'merci de me contacter si vous les trouvez']
        },
        {
            nom: 'chat Filou',
            adjectif: ['noir', 'craintif', 'tatoué/pucé'],
            verbe: ['je recherche désespérément', 'avis de recherche pour', 'j\'ai perdu mon'],
            detailsSpecifiques: ['perdu depuis [date] aux alentours de la gare', 'il est craintif mais gentil', 'récompense offerte']
        },
        {
            nom: 'doudou en peluche',
            adjectif: ['coloré', 'en peluche', 'pour enfant'],
            verbe: ['j\'ai trouvé un', 'avis de trouvaille pour un', 'propriétaire recherché pour un'],
            detailsSpecifiques: ['près de l\'école', 'il attend sagement son propriétaire', 'disponible pour récupération']
        },
        {
            nom: 'livre',
            adjectif: [' de poche', 'édition Or', 'oublié'],
            verbe: ['j\'ai trouvé un', 'livre trouvé :', 'à récupérer : un'],
            detailsSpecifiques: ['dans le bus ligne [numéro de la ligne]', 'titre : [titre du livre]', 'contactez-moi pour le récupérer']
        },
        {
            nom: 'portefeuille',
            adjectif: ['contenant des papiers', 'en cuir/tissu', 'de couleur bleu'],
            verbe: ['j\'ai trouvé un', 'avis de trouvaille pour un', 'à récupérer : un'],
            detailsSpecifiques: ['au nom de [Nom si visible]', 'dans le bus ligne 33', 'à côté du cinéma', 'à récupérer au commissariat ou contactez-moi']
        },
        {
            nom: 'lunettes de vue',
            adjectif: ['correctrices', 'monture rouge', 'indispensables'],
            verbe: ['j\'ai perdu mes', 'recherche mes', 'avis de perte pour mes'],
            detailsSpecifiques: ['dans un étui bleu avec [détail]', 'perdues vers la gare', 'forte correction, merci de votre aide']
        },
        {
            nom: 'smartphone',
            adjectif: ['de petite taille', 'noir', 'avec coque '],
            verbe: ['j\'ai trouvé un', 'téléphone trouvé :', 'à réclamer : un'],
            detailsSpecifiques: ['trouvé près de la gare', 'allumé et fonctionnel', 'merci de décrire le fond d\'écran pour identification']
        }
    ],
    [PostCategory.CATEGORY_2]: [
        {
            nom: 'chatons',
            adjectif: ['adorables', 'sevrés', 'sociables'],
            verbe: ['je propose à l\'adoption des', 'je cherche des familles pour des', 'à adopter : des'],
            detailsSpecifiques: ['disponibles à partir de la semaine prochaine', 'mère visible, élevés en famille', 'participation demandée pour les frais vétérinaires']
        },
        {
            nom: 'cage pour rongeur',
            adjectif: ['en bois', 'très bon état', 'équipée'],
            verbe: ['je vends une', 'je cède une', 'à vendre : une'],
            detailsSpecifiques: ['avec accessoires (roue, biberon)', 'prix : 8 €', 'dimensions : 2m x 1m, bois massif']
        },
        {
            nom: 'chien',
            adjectif: ['type Labrador', 'femelle', 'affectueux'],
            verbe: ['je cherche une nouvelle famille pour un', 'à confier : un', 'recherche adoptants pour un'],
            detailsSpecifiques: ['Femelle de 5 ans, stérilisée', 'très affectueux, besoin d\'un jardin', 'sous contrat associatif']
        },
        {
            nom: 'arbre à chat',
            adjectif: ['grand', 'multi-niveaux', 'stable'],
            verbe: ['je donne un', 'à récupérer gratuitement : un', 'j\'offre un'],
            detailsSpecifiques: ['avec griffoirs, niches et plateformes', 'bon état général, peu servi', 'à venir chercher sur place, prévoir véhicule adapté']
        },
        {
            nom: 'paire de perruches',
            adjectif: ['colorées', 'jeunes', 'inséparables'],
            verbe: ['je cherche une famille pour une', 'à adopter : une', 'je donne contre bons soins une'],
            detailsSpecifiques: ['mâle et femelle, non-consanguins', 'ne peuvent être vendues séparément', 'cage et accessoires peuvent être inclus (à discuter)']
        }
    ],
    [PostCategory.CATEGORY_3]: [
        {
            nom: 'vélo',
            adjectif: ['excellent état', ' de ville', 'révisé'],
            verbe: ['je vends un', 'à vendre : un', 'je propose ce'],
            detailsSpecifiques: ['marque de luxe, modèle récent', 'peu servi, révisé récemment', 'prix à négocier, à débattre légèrement']
        },
        {
            nom: 'bibliothèque',
            adjectif: ['IKEA', 'bleu', 'bon état général'],
            verbe: ['je mets en vente une', 'à céder : une', 'je vends une'],
            detailsSpecifiques: ['couleur bleu, grand modèle', 'quelques traces d\'usure discrètes', 'prix à négocier']
        },
        {
            nom: 'vêtements ',
            adjectif: ['bébé 0-6 mois', 'très bon état', 'marques diverses', 'de femme'],
            verbe: ['je vends un', 'lot à vendre :', 'je propose un'],
            detailsSpecifiques: ['bodies, pyjamas, petites tenues', 'propres, non tachés', 'prix du lot : 5 €']
        },
        {
            nom: 'smartphone Android',
            adjectif: ['Google', '16Go', 'fonctionnel'],
            verbe: ['je cède mon', 'à vendre : un', 'je vends mon'],
            detailsSpecifiques: ['modèle Pixel, 16 Go de stockage', 'fonctionne parfaitement, écran sans rayures', 'vendu avec chargeur, prix à négocier']
        },
        {
            nom: 'table basse',
            adjectif: ['design elegant', 'bois massif', 'comme neuve'],
            verbe: ['je vends ma', 'à vendre : une', 'je propose une'],
            detailsSpecifiques: ['dimensions 2m x 1m, bois massif', 'achetée en magasin, il y a 1 an', 'prix à négocier, cause déménagement']
        },
        {
            nom: 'console de jeux',
            adjectif: ['PS4', 'avec manettes', 'parfait état'],
            verbe: ['je vends une', 'console à vendre :', 'je cède ma'],
            detailsSpecifiques: ['inclut 2 manettes et de nombreux jeux', 'très peu utilisée', ' boîte d\'origine disponible']
        }
    ],
    [PostCategory.CATEGORY_4]: [
        {
            nom: 'canapé',
            adjectif: ['trois places', 'tissu vert', 'confortable'],
            verbe: ['je donne un', 'à récupérer gratuitement : un', 'j\'offre ce'],
            detailsSpecifiques: ['structure en bon état, tissu un peu usé par endroits', 'dimensions : [Dimensions]', 'à venir chercher sur place (prévoir des bras !)']
        },
        {
            nom: 'lot de jouets enfants',
            adjectif: ['3-5 ans', 'bon état', 'propres'],
            verbe: ['j\'offre un', 'je donne un', 'à récupérer gratuitement : un'],
            detailsSpecifiques: ['puzzles, cubes, petites voitures', 'en bon état, complets', 'idéal pour une seconde vie']
        },
        {
            nom: 'livres de poche',
            adjectif: ['variés', 'bon état', 'divers genres'],
            verbe: ['je donne des', 'j\'offre des', 'à prendre : des'],
            detailsSpecifiques: ['romans, policiers, science-fiction', 'pour libérer de la place', 'à récupérer rapidement']
        },
        {
            nom: 'plantes',
            adjectif: ['d\'intérieur', 'faciles d\'entretien', 'pour boutures'],
            verbe: ['je propose des', 'je donne des', 'à récupérer : des'],
            detailsSpecifiques: ['boutures de misère, plante araignée...', 'en bonne santé', 'à venir chercher']
        },
        {
            nom: 'service de vaisselle de table',
            adjectif: ['décoratif', 'porcelaine', 'vintage'],
            verbe: ['je donne un', 'à récupérer : un', 'j\'offre un'],
            detailsSpecifiques: ['manque quelques assiettes et tasses', 'idéal pour compléter, pour création ou décoration', 'à venir chercher, carton non fourni']
        },
        {
            nom: 'vêtements adulte',
            adjectif: ['taille [taille]', 'bon état', 'variés'],
            verbe: ['je donne des', 'à prendre gratuitement : des', 'j\'offre des'],
            detailsSpecifiques: ['chemises, pantalons, pulls femme', 'propres et prêts à être portés', 'pour personne dans le besoin ou association']
        }
    ],
    [PostCategory.CATEGORY_5]: [
        {
            nom: 'matériel de puériculture',
            adjectif: ['divers', 'bon état', 'utile'],
            verbe: ['je vends du', 'à vendre (prix par article) :', 'je propose du'], // Choix de 'vends'
            detailsSpecifiques: ['poussette, lit parapluie, chaise haute...', 'photos et prix sur demande', 'me contacter pour la liste et les prix']
        },
        {
            nom: 'Outils de bricolage',
            adjectif: ['peu utilisés', 'variés', 'fonctionnels'],
            verbe: ['je vends un', 'lot à vendre :', 'je cède un'],
            detailsSpecifiques: ['perceuse, scie sauteuse, tournevis...', 'ensemble ou séparément (à discuter)', 'prix pour le lot : 35 €']
        },
        {
            nom: 'service de vaisselle ancien',
            adjectif: ['porcelaine de [Origine]', 'complet', 'décoratif'],
            verbe: ['je cède un', 'à vendre (négociable) :', 'je propose un'],
            detailsSpecifiques: ['complet pour 6 personnes, en porcelaine de Limoges', 'idéal pour collectionneur ou décoration', 'prix à discuter']
        },
        {
            nom: 'billet de concert',
            adjectif: ['non utilisé', 'Jul', 'place premium'],
            verbe: ['je vends un', 'à vendre : un', 'je cède mon'],
            detailsSpecifiques: ['pour à [heure] à la gare', 'impossibilité d\'y assister', 'prix coûtant : 35 € ou meilleure offre']
        },
        {
            nom: 'fournitures scolaires',
            adjectif: ['neuves/très peu utilisées', 'variées', 'utiles', '/de bureau'],
            verbe: ['je donne des', 'à récupérer gratuitement : des', 'j\'offre des'],
            detailsSpecifiques: ['cahiers, stylos, classeurs, papier', 'restes non utilisés', 'pour étudiants, associations ou dépannage']
        }
    ],
};
// SONDAGES
const surveyElementsByCategory: Record<SurveyCategory, ElementSpecifique[]> = {
    [SurveyCategory.CATEGORY_1]: [ // Vie Quotidienne & Voisinage
        {
            nom: 'l\'utilisation des espaces communs',
            adjectif: ['vélos', 'poussettes', 'partagé'],
            verbe: ['nous vous consultons sur', 'donnez votre avis pour', 'exprimez-vous concernant'],
            verbeJe: ['je vous consulte sur', 'je souhaite votre avis pour', 'je vous invite à vous exprimer concernant'],
            detailsSpecifiques: ['horaires d\'accès, règles de rangement', 'afin d\'éviter les conflits et nuisances', 'votre avis est important pour la tranquillité de tous']
        },
        {
            nom: 'gestion du bruit',
            adjectif: ['nocturne', 'collectif', 'respectueux'],
            verbe: ['nous recueillons votre opinion sur', 'participez à l\'enquête sur', 'aidez-nous à définir les règles pour'],
            verbeJe: ['je recueille votre opinion sur', 'je vous invite à participer à l\'enquête sur', 'j\'aimerais définir avec vous les règles pour'],
            detailsSpecifiques: ['horaires à respecter en soirée et le week-end', 'types de nuisances sonores à modérer', 'pour un voisinage plus serein, des propositions concrètes sont attendues']
        },
        {
            nom: 'propreté ',
            adjectif: ['des parties communes', 'collective', 'régulière', 'essentielle'],
            verbe: ['nous souhaitons votre avis sur', 'évaluez la situation de la', 'proposez des solutions pour la'],
            verbeJe: ['je souhaite votre avis sur', 'j\'évalue la situation de la', 'je propose de trouver des solutions pour la'],
            detailsSpecifiques: ['état actuel du hall, des escaliers, des abords', 'fréquence de nettoyage, respect des lieux', 'ensemble, améliorons notre cadre de vie']
        },
        {
            nom: 'stationnement',
            adjectif: ['résidentiel', 'organisé', 'optimisé'],
            verbe: ['nous vous interrogeons sur le', 'partagez vos idées pour le', 'contribuez à améliorer le'],
            verbeJe: ['je vous interroge sur le', 'je vous invite à partager vos idées pour le', 'je souhaite contribuer à améliorer le'],
            detailsSpecifiques: ['attribution des places, stationnement visiteurs', 'problèmes rencontrés (gênes, abus)', 'pour un stationnement plus fluide et respectueux']
        }
    ],
    [SurveyCategory.CATEGORY_2]: [ // Projets & Améliorations Immeuble/Résidence
        {
            nom: 'rénovation façade immeuble',
            adjectif: ['esthétique', 'isolante', 'budgétée'],
            verbe: ['nous vous sondons sur la', 'choisissez les options pour la', 'validez les propositions pour la'],
            verbeJe: ['je vous sonde sur la', 'je vous invite à choisir les options pour la', 'je vous propose de valider les propositions pour la'],
            detailsSpecifiques: ['choix des couleurs, type de matériaux, isolation thermique', 'impact sur les charges et valorisation du bien', 'avant de lancer les demandes de devis']
        },
        {
            nom: 'aménagement jardin partagé',
            adjectif: ['convivial', 'écologique', 'participatif'],
            verbe: ['nous évaluons votre intérêt pour l\'', 'imaginez avec nous l\'', 'impliquez-vous dans l\''],
            verbeJe: ['j\'évalue votre intérêt pour l\'', 'je vous invite à imaginer l\'', 'je vous propose de vous impliquer dans l\''],
            detailsSpecifiques: ['types de plantations (potager, fleurs), organisation collective', 'qui serait prêt à s\'investir (temps, compétences) ?', 'un projet pour plus de verdure et de lien social']
        },
        {
            nom: 'installation de bornes de recharge',
            adjectif: ['électrique', 'collective', 'future'],
            verbe: ['nous étudions la faisabilité pour l\'', 'exprimez vos besoins concernant l\'', 'participez à la décision sur l\''],
            verbeJe: ['j\'étudie la faisabilité pour l\'', 'je vous invite à exprimer vos besoins concernant l\'', 'je vous propose de participer à la décision sur l\''],
            detailsSpecifiques: ['pour véhicules électriques et hybrides', 'nombre de bornes, emplacement, modalités d\'utilisation', 'anticiper les besoins de mobilité durable']
        },
        {
            nom: 'sécurité des accès',
            adjectif: ['renforcée', 'moderne', 'préventive'],
            verbe: ['nous vous consultons sur la', 'donnez votre avis sur les options de', 'aidez-nous à prioriser la'],
            verbeJe: ['je vous consulte sur la', 'je vous invite à donner votre avis sur les options de', 'je vous propose d\'aider à prioriser la'],
            detailsSpecifiques: ['portes d\'entrée, interphones, vidéosurveillance', 'prévention des intrusions et dégradations', 'pour la tranquillité et la sécurité de tous']
        }
    ],
    [SurveyCategory.CATEGORY_3]: [ // Vie de Quartier & Environnement
        {
            nom: 'qualité de vie quartier',
            adjectif: ['globale', 'perçue', 'évolutive'],
            verbe: ['nous voulons connaître votre ressenti sur la', 'évaluez la', 'faites vos suggestions pour la'],
            verbeJe: ['je souhaite connaître votre ressenti sur la', 'je vous invite à évaluer la', 'je vous propose de faire vos suggestions pour la'],
            detailsSpecifiques: ['points positifs, points à améliorer (sécurité, propreté, animations)', 'ressenti général sur l\'ambiance du quartier', 'vos suggestions sont les bienvenues pour agir ensemble']
        },
        {
            nom: 'commerces de proximité',
            adjectif: ['existants', 'souhaités', 'accessibles'],
            verbe: ['nous aimerions avoir votre avis sur les', 'identifiez les besoins concernant les', 'soutenez le développement des'],
            verbeJe: ['j\'aimerais avoir votre avis sur les', 'je vous invite à identifier les besoins concernant les', 'je vous propose de soutenir le développement des'],
            detailsSpecifiques: ['offre actuelle, types de commerces manquants', 'horaires d\'ouverture souhaités, qualité des services', 'pour dynamiser notre économie locale et faciliter le quotidien']
        },
        {
            nom: 'mobilité dans le quartier',
            adjectif: ['piétonne', 'cyclable', 'sécurisée'],
            verbe: ['nous recueillons vos idées sur la', 'contribuez à améliorer la', 'imaginez une meilleure'],
            verbeJe: ['je recueille vos idées sur la', 'je vous invite à contribuer à améliorer la', 'je vous propose d\'imaginer une meilleure'],
            detailsSpecifiques: ['aménagements pour vélos et piétons', 'sécurité des traversées, zones de rencontre', 'pour des déplacements plus agréables et écologiques']
        },
        {
            nom: 'offre culturelle et sportive locale',
            adjectif: ['actuelle', 'désirée', 'accessible'],
            verbe: ['nous vous interrogeons sur l\'', 'exprimez vos attentes pour l\'', 'aidez à enrichir l\''],
            verbeJe: ['je vous interroge sur l\'', 'je vous invite à exprimer vos attentes pour l\'', 'je vous propose d\'aider à enrichir l\''],
            detailsSpecifiques: ['infrastructures existantes (bibliothèque, stade, etc.)', 'activités ou événements que vous aimeriez voir', 'pour un quartier plus vivant et animé']
        }
    ],
    [SurveyCategory.CATEGORY_4]: [ // Événements & Activités Collectives
        {
            nom: 'choix date fête des voisins',
            adjectif: ['prochaine', 'conviviale', 'participative'],
            verbe: ['nous vous demandons votre préférence pour le', 'aidez-nous à fixer le', 'votez pour le'],
            verbeJe: ['je vous demande votre préférence pour le', 'je vous invite à m\'aider à fixer le', 'je vous propose de voter pour le'],
            detailsSpecifiques: ['plusieurs options de week-ends cet été', 'afin de maximiser la participation et la convivialité', 'répondez avant le [date limite] pour organisation']
        },
        {
            nom: 'activités vide-grenier',
            adjectif: ['annuel', 'festif', 'attractif'],
            verbe: ['nous sollicitons vos idées pour les', 'proposez des', 'imaginez les futures'],
            verbeJe: ['je sollicite vos idées pour les', 'je vous invite à proposer des', 'je vous propose d\'imaginer les futures'],
            detailsSpecifiques: ['stand de crêpes, animation musicale, jeux pour enfants...', 'pour rendre l\'événement plus attractif et familial', 'toutes les propositions seront étudiées avec attention']
        },
        {
            nom: 'organisation d\'un repas',
            adjectif: ['intergénérationnel', 'thématique', 'régulier'],
            verbe: ['seriez-vous intéressé par l\'', 'aidez à planifier l\'', 'participez à la création d\'une'],
            verbeJe: ['je vous demande si vous seriez intéressé par l\'', 'je vous invite à m\'aider à planifier l\'', 'je vous propose de participer à la création d\'une'],
            detailsSpecifiques: ['format (pique-nique, buffet), fréquence (mensuel, trimestriel)', 'choix d\'un thème culinaire ou festif', 'pour renforcer les liens et partager de bons moments']
        },
        {
            nom: 'ateliers thématiques',
            adjectif: ['créatifs', 'pratiques', 'pédagogiques'],
            verbe: ['nous aimerions connaître votre intérêt pour des', 'suggérez des thèmes pour des', 'indiquez votre disponibilité pour des'],
            verbeJe: ['j\'aimerais connaître votre intérêt pour des', 'je vous invite à suggérer des thèmes pour des', 'je vous propose d\'indiquer votre disponibilité pour des'],
            detailsSpecifiques: ['exemples : cuisine, bricolage, jardinage, informatique', 'partage de savoir-faire entre voisins', 'quelles compétences aimeriez-vous acquérir ou transmettre ?']
        }
    ],
    [SurveyCategory.CATEGORY_5]: [ // Initiatives & Projets Citoyens
        {
            nom: 'création covoiturage quartier',
            adjectif: ['solidaire', 'écologique', 'économique'],
            verbe: ['nous mesurons votre intérêt pour la', 'impliquez-vous dans la', 'imaginez un système de'],
            verbeJe: ['je mesure votre intérêt pour la', 'je vous invite à vous impliquer dans la', 'je vous propose d\'imaginer un système de'],
            detailsSpecifiques: ['pour les trajets domicile-travail, les courses, les loisirs', 'seriez-vous conducteur, passager, ou les deux ?', 'réduire les coûts et l\'impact environnemental']
        },
        {
            nom: 'installation composteurs collectifs',
            adjectif: ['écologiques', 'partagés', 'accessibles'],
            verbe: ['nous vous consultons sur l\'', 'participez au projet d\'', 'exprimez-vous sur l\''],
            verbeJe: ['je vous consulte sur l\'', 'je vous invite à participer au projet d\'', 'je vous propose de vous exprimer sur l\''],
            detailsSpecifiques: ['emplacements possibles, formation à l\'utilisation, gestion', 'réduire nos déchets organiques ensemble', 'un geste concret pour l\'environnement']
        },
        {
            nom: 'mise en place d\'une boîte à dons',
            adjectif: ['solidaire', 'accessible', 'autogérée'],
            verbe: ['que pensez-vous de la', 'contribuez à la réflexion sur la', 'seriez-vous utilisateur de la'],
            verbeJe: ['je vous demande ce que vous pensez de la', 'je vous invite à contribuer à la réflexion sur la', 'je vous propose d\'être utilisateur de la'],
            detailsSpecifiques: ['objets du quotidien (livres, petits objets, vêtements propres)', 'emplacement, règles de dépôt et de prise', 'favoriser la seconde vie des objets et l\'entraide']
        },
        {
            nom: 'création d\'un journal de quartier',
            adjectif: ['informatif', 'collaboratif', 'numérique/papier'],
            verbe: ['nous étudions la possibilité d\'une', 'seriez-vous contributeur à une', 'qu\'attendez-vous d\'une'],
            verbeJe: ['j\'étudie la possibilité d\'une', 'je vous propose d\'être contributeur à une', 'je vous demande ce que vous attendez d\'une'],
            detailsSpecifiques: ['actualités locales, initiatives, portraits d\'habitants', 'format (numérique, papier), fréquence de parution', 'renforcer l\'information et le lien social dans le quartier']
        }
    ],
};
// CAGNOTTES (POOL)
const poolSubjects = [
    'projet associatif',
    'aide familiale', // "à une famille" est une précision, le nom est "aide familiale"
    'financement événement',
    'achat matériel',
    'soutien à un voisin', // Gardé car "voisin" est spécifique
    'action de solidarité', // Adjectif supprimé de "action"
    'projet d\'école', // Adjectif supprimé
    'initiative citoyenne', // Adjectif supprimé
    'soutien médical',
    'projet culturel'
];
const poolObjectifs = [
    'réunir des fonds',
    'soutenir une cause',
    'financer une activité',
    'aider un membre de la communauté',
    'réaliser un projet collectif',
    'apporter une aide concrète',
    'contribuer à la réussite d\'une initiative',
    'manifester notre solidarité',
    'couvrir des frais urgents',
    'rendre possible un rêve'
];
const poolActions = [
    'Participez selon vos moyens',
    'Chaque don compte',
    'Merci pour votre générosité',
    'Ensemble, c\'est possible',
    'Mobilisons-nous pour cette cause',
    'Faites passer le mot autour de vous',
    'Soutenez ce projet important',
    'Un petit geste pour un grand impact',
    'Contribuez maintenant',
    'Votre soutien fait la différence'
];
const poolAppels = [
    'Merci infiniment à tous',
    'Votre aide est précieuse',
    'Partagez cet appel à la générosité',
    'Faites un geste solidaire aujourd\'hui',
    'Ensemble, nous pouvons y arriver',
    'Merci de votre contribution',
    'Solidarité et entraide',
    'Aidez-nous à atteindre notre objectif',
    'Comptons sur vous',
    'Votre générosité est essentielle'
];

// GROUPES

const groupElementsByCategory: Record<GroupCategory, ElementSpecifique[]> = {
    [GroupCategory.CATEGORY_1]: [ // Initiatives de Quartier
        {
            nom: 'Collectif Cadre de Vie',
            adjectif: ['actif', 'local', 'participatif'],
            verbe: ['rejoignez notre', 'participez au', 'contribuez au'],
            detailsSpecifiques: ['proposer des idées, monter des projets concrets', 'plus de verdure, propreté, lien social', 'première réunion d\'information']
        },
        {
            nom: 'Entraide Voisins',
            adjectif: ['solidaire', 'convivial', 'réciproque'],
            verbe: ['lance la création d\'un', 'rejoignez le réseau d\'', 'participez à l\''],
            detailsSpecifiques: ['petits services, covoiturage, garde d\'enfants ponctuelle', 'basé sur la confiance et la bienveillance', 'inscrivez-vous pour plus de solidarité locale']
        },
        {
            nom: 'Jardiniers du Coin',
            adjectif: ['verts', 'passionnés', 'collectifs'],
            verbe: ['formons ensemble les', 'cultivez avec les', 'rejoignez les'],
            detailsSpecifiques: ['partage de parcelles ou jardinage collectif', 'échange de graines, astuces et récoltes', 'pour embellir le quartier et manger local']
        },
        {
            nom: 'Répar\'Café Local',
            adjectif: ['bricoleur', 'anti-gaspi', 'convivial'],
            verbe: ['lançons un', 'participez au', 'devenez bénévole au'],
            detailsSpecifiques: ['réparer ensemble objets du quotidien (électro, vélos, vêtements)', 'apprendre et transmettre des savoir-faire', 'prochain atelier, apportez vos objets !']
        }
    ],
    [GroupCategory.CATEGORY_2]: [ // Vie de la Copropriété/Résidence
        {
            nom: 'Conseil Syndical +', // "+" pour participatif et dynamique
            adjectif: ['transparent', 'efficace', 'ouvert'],
            verbe: ['nous souhaitons mettre en place un', 'impliquez-vous dans le', 'construisons ensemble un'],
            detailsSpecifiques: ['réunions régulières ouvertes, communication améliorée', 'prise de décision collective pour la copropriété', 'votre implication est la bienvenue pour une gestion proactive']
        },
        {
            nom: 'Groupe Espaces Verts Résidence',
            adjectif: ['résidentiel', 'volontaire', 'créatif'],
            verbe: ['nous proposons de former le', 'participez à l\'entretien avec le', 'embellissez votre résidence avec le'],
            detailsSpecifiques: ['plantations, désherbage, arrosage collectif des espaces communs', 'pour un lieu de vie plus agréable et fleuri', 'amoureux de la nature, manifestez-vous !']
        },
        {
            nom: 'Comité Fêtes Résidence',
            adjectif: ['festif', 'organisé', 'convivial'],
            verbe: ['créons un', 'rejoignez le', 'animez la résidence avec le'],
            detailsSpecifiques: ['organisation de la fête des voisins, goûters, etc.', 'pour renforcer les liens entre résidents', 'toutes les bonnes volontés sont les bienvenues']
        },
        {
            nom: 'Voisins Vigilants Résidence',
            adjectif: ['attentifs', 'solidaires', 'préventifs'],
            verbe: ['mettons en place le réseau', 'adhérez au dispositif', 'protégeons ensemble notre résidence via'],
            detailsSpecifiques: ['veille collective pour la sécurité des biens et personnes', 'communication rapide en cas d\'incident', 'en lien avec les autorités compétentes si besoin']
        }
    ],
    [GroupCategory.CATEGORY_3]: [ // Citoyenneté & Engagement Local
        {
            nom: 'Asso Citoyenne [Arrond.]', // Nom de l'arrondissement à préciser
            adjectif: ['engagée', 'représentative', 'active'],
            verbe: ['est en cours de création :', 'rejoignez l\'', 'devenez membre de l\''],
            detailsSpecifiques: ['porter la voix des habitants auprès de la mairie', 'organiser des événements et débats publics', 'toutes les bonnes volontés sont recherchées pour agir']
        },
        {
            nom: 'Réseau Culture Interquartiers',
            adjectif: ['curieux', 'ouvert', 'dynamique'],
            verbe: ['nous imaginons un', 'participez à la création d\'un', 'découvrez et partagez avec le'],
            detailsSpecifiques: ['partage de bons plans (expos, concerts, spectacles)', 'organisation de sorties culturelles groupées', 'pour découvrir la richesse de notre ville/arrondissement']
        },
        {
            nom: 'Collectif Mobilité Douce',
            adjectif: ['urbain', 'écologique', 'revendicatif'],
            verbe: ['formons un', 'militez avec le', 'déplacez-vous autrement grâce au'],
            detailsSpecifiques: ['promotion du vélo et de la marche en ville', 'demandes d\'aménagements sécurisés', 'pour une ville plus respirable et accessible']
        },
        {
            nom: 'Parents d\'Élèves Actifs',
            adjectif: ['impliqués', 'constructifs', 'vigilants'],
            verbe: ['constituons un groupe de', 'rejoignez les', 'agissez pour l\'école avec les'],
            detailsSpecifiques: ['dialogue avec l\'équipe enseignante et la mairie', 'organisation d\'événements pour l\'école', 'amélioration du quotidien des enfants']
        }
    ],
    [GroupCategory.CATEGORY_4]: [ // Loisirs & Passions
        {
            nom: 'Club Lecture',
            adjectif: ['convivial', 'ouvert', 'mensuel'],
            verbe: ['nous vous proposons de créer un', 'rejoignez notre', 'partagez vos lectures au'],
            detailsSpecifiques: ['rencontres pour discuter de coups de cœur littéraires', 'tous les genres sont les bienvenus (roman, BD, essai...)', 'partage, découverte et bonne humeur assurés']
        },
        {
            nom: 'Marcheurs du Dimanche',
            adjectif: ['matinaux', 'réguliers', 'tous niveaux'],
            verbe: ['cherche à s\'agrandir :', 'rejoignez les', 'gardez la forme avec les'],
            detailsSpecifiques: ['parcours variés aux alentours de [Ville/Quartier]', 'pour garder la forme, papoter et découvrir les environs', 'départ à 9h, ambiance décontractée']
        },
        {
            nom: 'Atelier Créatif Partagé',
            adjectif: ['artistique', 'hebdomadaire', 'inspirant'],
            verbe: ['ouvre ses portes :', 'participez à l\'', 'exprimez votre créativité à l\''],
            detailsSpecifiques: ['pour débutants ou confirmés (dessin, peinture, couture, etc.)', 'partage de techniques, d\'idées et de matériel', 'matériel de base à apporter, convivialité exigée !']
        },
        {
            nom: 'Ciné-Club Quartier',
            adjectif: ['passionné', 'éclectique', 'convivial'],
            verbe: ['lançons un', 'rejoignez le', 'discutez cinéma au'],
            detailsSpecifiques: ['projections régulières suivies de débats', 'films d\'auteur, classiques, documentaires', 'pour partager la passion du 7ème art']
        },
        {
            nom: 'Groupe Photo Balade',
            adjectif: ['amateur', 'explorateur', 'bienveillant'],
            verbe: ['formons un', 'capturez l\'instant avec le', 'progressez en photo avec le'],
            detailsSpecifiques: ['sorties photo thématiques en ville ou nature', 'partage de conseils techniques et artistiques', 'tous niveaux et tous types d\'appareils bienvenus']
        }
    ],
    [GroupCategory.CATEGORY_5]: [ // Échanges & Communautés d'Intérêt
        {
            nom: 'Débat Écologie Quotidien',
            adjectif: ['pratique', 'bienveillant', 'inspirant'],
            verbe: ['nous souhaitons initier un', 'participez au', 'échangez au sein du'],
            detailsSpecifiques: ['partage d\'astuces zéro déchet, recettes de produits maison', 'pour un mode de vie plus durable et conscient', 'échanges constructifs et sans jugement']
        },
        {
            nom: 'Club Jeux Société',
            adjectif: ['ludique', 'stratégique', 'amical'],
            verbe: ['se forme ! Rejoignez le', 'jouez avec le', 'découvrez de nouveaux jeux au'],
            detailsSpecifiques: ['soirées jeux régulières (plateau, cartes, rôles)', 'découverte de nouveautés, ambiance fun et stratégique', 'apportez vos jeux préférés et votre bonne humeur']
        },
        {
            nom: 'Cuisine du Monde Partage',
            adjectif: ['gourmand', 'interculturel', 'convivial'],
            verbe: ['créons un groupe', 'cuisinez et dégustez avec', 'partagez vos recettes au sein de'],
            detailsSpecifiques: ['ateliers cuisine thématiques (pays, régions)', 'chacun apporte des ingrédients ou une spécialité', 'pour découvrir de nouvelles saveurs et cultures']
        },
        {
            nom: 'Musiciens Amateurs Locaux',
            adjectif: ['passionnés', 'collaboratifs', 'tous styles'],
            verbe: ['formons un collectif de', 'jouez avec les', 'rencontrez d\'autres'],
            detailsSpecifiques: ['sessions de bœuf (jam sessions), petites répétitions', 'partage de plans, création de morceaux', 'pour le plaisir de jouer ensemble, tous instruments bienvenus']
        }
    ],
};
// --- Listes de phrases de complément pour les descriptions ---
const eventContextPhrases = [
    "Cet événement est une excellente occasion de se rencontrer entre voisins.",
    "Nous espérons vous y voir nombreux pour partager un bon moment.",
    "L'ambiance promet d'être [ambiance] et conviviale.",
    "C'est une initiative pour dynamiser la vie de notre quartier à [ville].",
    "N'oubliez pas de consulter les détails pratiques ci-dessous.",
    "Pensez à inviter vos amis et votre famille !",
    "L'entrée est libre et ouverte à tous.",
    "Une petite participation pourra être demandée pour couvrir les frais."
];

const serviceContextPhrases = [
    "Je suis une personne de confiance et je serai ravi de vous aider.",
    "N'hésitez pas à me contacter pour discuter de vos besoins spécifiques.",
    "Ce service est proposé dans un esprit d'entraide et de bon voisinage à [ville].",
    "Je suis disponible principalement [disponibilité type: le week-end / en soirée].",
    "Une réponse rapide vous sera apportée.",
    "Au plaisir de vous rendre service !",
    "Je peux me déplacer dans un rayon raisonnable autour de [lieu précis ou quartier].",
    "Ce service est proposé bénévolement / contre une petite participation / à un tarif solidaire."
];

const postContextPhrases = { // Spécifique à la catégorie de post
    [PostCategory.CATEGORY_1]: [
        "Merci d'avance pour votre aide et vos partages.",
        "J'espère vraiment le/la retrouver rapidement grâce à vous.",
        "Le propriétaire sera ravi de le/la récupérer.",
        "Contactez-moi vite si vous avez des informations.",
        "C'est un objet sentimental important.",
        "Une récompense est promise à celui ou celle qui le/la rapportera."
    ],
    [PostCategory.CATEGORY_2]: [
        "N'hésitez pas à me contacter pour plus d'informations ou de photos.",
        "Le prix est négociable dans la limite du raisonnable.",
        "Premier contact par messagerie souhaité.",
        "Remise en main propre uniquement sur [ville] ou alentours.",
        "Pas d'envoi possible pour cet article.",
        "Idéal pour une seconde vie !"
    ],
    [PostCategory.CATEGORY_3]: [
        "À récupérer rapidement, premier arrivé, premier servi !",
        "Cela fera certainement plaisir à quelqu'un.",
        "Je préfère donner plutôt que jeter.",
        "Pas de réservation, merci de votre compréhension.",
        "Venez le chercher à [lieu précis ou quartier] quand vous voulez (sur RDV).",
        "Un petit geste pour la planète et pour vos voisins."
    ],
    [PostCategory.CATEGORY_4]: [ // Pour les animaux à donner/vendre (pas perdus/trouvés ici)
        "Ces animaux méritent une famille aimante et attentionnée.",
        "Un suivi pourra être demandé pour s'assurer de leur bien-être.",
        "N'hésitez pas à venir les rencontrer.",
        "Plus d'informations sur leur caractère par message.",
        "Nous cherchons des adoptants responsables."
    ],
    [PostCategory.CATEGORY_5]: [
        "N'hésitez pas à me poser vos questions.",
        "Plus de détails disponibles sur demande.",
        "À voir sur [ville].",
        "Curieux s'abstenir, merci.",
        "Possibilité de faire un lot si plusieurs articles vous intéressent."
    ]
};

const surveyContextPhrases = [
    "Votre participation est anonyme et ne prendra que quelques minutes.",
    "Les résultats de ce sondage nous aideront à prendre les bonnes décisions pour notre communauté à [ville].",
    "Merci de prendre le temps de répondre.",
    "Plus nous aurons de réponses, plus les actions menées seront représentatives.",
    "N'hésitez pas à partager ce sondage avec vos voisins concernés.",
    "La date limite pour répondre est le [date limite fictive].",
    "Ensemble, améliorons notre cadre de vie !"
];

const poolContextPhrases = [
    "Chaque contribution, même modeste, nous sera d'une grande aide.",
    "Merci d'avance pour votre générosité et votre soutien à ce projet important pour [ville].",
    "N'hésitez pas à partager cette cagnotte autour de vous.",
    "Ensemble, nous pouvons atteindre notre objectif rapidement.",
    "Les fonds récoltés seront utilisés exclusivement pour [objectif de la cagnotte].",
    "Nous vous tiendrons informés de l'avancement du projet.",
    "Un grand merci du fond du cœur pour votre solidarité."
];

const groupContextPhrases = [
    "Rejoignez-nous pour faire une différence dans notre quartier de [ville] !",
    "L'ambiance y est conviviale et les idées de chacun sont les bienvenues.",
    "C'est une belle opportunité de rencontrer d'autres habitants partageant les mêmes intérêts.",
    "Plus nous serons nombreux, plus nos actions auront de l'impact.",
    "N'hésitez pas à nous contacter pour plus d'informations sur nos activités.",
    "La première rencontre/prochaine réunion aura lieu à la gare.",
    "Ensemble, construisons un quartier où il fait bon vivre."
];

// MESSAGES COURTS (Doit être déclaré ici, au niveau global)
const motsTexteMessage = {
    intro: [
        'Bonjour à tous', 'Salut le quartier', 'Coucou les voisins', 'Petite info', 'Message rapide', 'Annonce importante'
        // Ajoutez plus de variations ici si vous le souhaitez
    ],
    corps: [
        'N\'hésitez pas à participer à cette initiative',
        'Merci pour votre aide et votre implication',
        'Bonne journée à tous et à toutes',
        'On compte sur vous pour faire vivre le quartier',
        'À bientôt pour de nouveaux projets ensemble',
        'Faites passer le mot autour de vous',
        'Contactez-moi si besoin de précisions',
        'Partagez autour de vous, c\'est important',
        'Merci pour votre attention et votre soutien',
        'On se retrouve bientôt pour échanger',
        'Votre participation est précieuse',
        'N\'hésitez pas à donner votre avis',
        'Restons solidaires et bienveillants',
        'Au plaisir de vous retrouver lors de l\'événement',
        'Votre retour est attendu avec impatience',
        'Ensemble, nous pouvons faire la différence',
        'Merci à tous pour votre mobilisation',
        'N\'oubliez pas d\'inviter vos voisins',
        'Pour toute question, je reste disponible',
        'Un grand merci pour votre engagement',
        'Votre présence sera très appréciée',
        'On espère vous voir nombreux',
        'Merci de relayer l\'information',
        'À très bientôt dans le quartier',
        'Votre soutien compte beaucoup pour nous',
        'N\'hésitez pas à proposer vos idées',
        'Merci de faire partie de cette belle communauté',
        'On avance ensemble, merci à tous',
        'À votre disposition pour en discuter',
        'Merci pour votre confiance',
        'On reste en contact pour la suite'
    ],
    conclusion: [
        'Merci à tous',
        'Bonne soirée',
        'À très vite',
        'Prenez soin de vous',
        'Au plaisir de vous lire',
        'À votre écoute',
        'Belle journée à chacun',
        'Merci pour votre confiance',
        'À bientôt dans le quartier',
        'Restons en lien',
        'À très bientôt',
        'Merci pour votre présence',
        'À la prochaine',
        'Merci pour votre participation',
        'À suivre !',
        'On se retrouve très vite',
        'Merci pour tout',
        'À votre disposition',
        'Au plaisir de vous rencontrer',
        'Merci et à bientôt'
        // Ajoutez plus de variations ici
    ]
};


// --- UTILS ---
export function piocherElement<T>(arr: T[], def: T | null = null): T {
    if (!arr || arr.length === 0) {
        if (def !== null) return def;
        if (typeof def === 'object' && def !== null) return def;
        if (typeof '' === typeof def || def === null) return '' as unknown as T;
        throw new Error("Array is empty and no default value of correct type provided.");
    }
    return arr[Math.floor(Math.random() * arr.length)];
}


//// MISE EN FORME DES PHRASES
export const capitaliser = (str: string = ''): string => str && str.charAt(0).toUpperCase() + str.slice(1)
export function finaliserPhrase(phrase: string): string {
    if (!phrase) return '';
    phrase = phrase.trim().replace(/\s+/g, ' ');
    phrase = phrase.replace(/\s*([?.!,:;])\s*/g, '$1 ').trim()
    phrase = phrase.replace(/([?.!,:;])\1+/g, '$1')
    if (!/[.!?]$/.test(phrase)) { (/[;:,\-–]$/.test(phrase)) ? phrase = phrase.slice(0, -1) + '.' : phrase += '.' }
    return capitaliser(phrase);
}


function genererPhrasesDescriptionCourte(phrasesSources: string[], elementSpecifique?: ElementSpecifique, options?: ContentOptions, nombreDePhrases = 2): string {
    const phrasesChoisies = new Set<string>();
    let tentatives = 0;

    const maxPhrasesPossibles = phrasesSources.length + (elementSpecifique?.detailsSpecifiques?.length || 0);
    nombreDePhrases = Math.min(nombreDePhrases, maxPhrasesPossibles, 3); // Max 3 phrases pour la description

    if (nombreDePhrases === 0) return "";

    // Priorité aux détails spécifiques de l'élément s'ils existent
    if (elementSpecifique?.detailsSpecifiques) {
        for (const detail of elementSpecifique.detailsSpecifiques) {
            if (phrasesChoisies.size < nombreDePhrases) {
                phrasesChoisies.add(finaliserPhrase(detail));
            } else break;
        }
    }

    // Compléter avec les phrases de contexte général
    while (phrasesChoisies.size < nombreDePhrases && tentatives < phrasesSources.length * 2 && phrasesSources.length > 0) {
        let phrase = piocherElement(phrasesSources);
        if (options?.ville) phrase = phrase.replace(/\[ville\]/g, options.ville);
        if (options?.date) phrase = phrase.replace(/\[date\]/g, options.date);
        if (elementSpecifique?.nom && (elementSpecifique.nom.includes("terrain") || elementSpecifique.nom.includes("salle"))) {
            phrase = phrase.replace(/\[lieu précis ou quartier\]/g, elementSpecifique.nom.substring(elementSpecifique.nom.indexOf("sur ") + 4 || elementSpecifique.nom.indexOf("à ") + 2));
        } else if (options?.ville) {
            phrase = phrase.replace(/\[lieu précis ou quartier\]/g, options.ville);
        }
        // Remplacer les placeholders génériques restants
        phrase = phrase.replace(/\[ambiance\]/g, piocherElement(['chaleureuse', 'festive', 'conviviale', 'sportive', 'détendue']));
        phrase = phrase.replace(/\[date limite fictive\]/g, "la fin de semaine prochaine");
        phrase = phrase.replace(/\[objectif de la cagnotte\]/g, "la réalisation de ce projet");
        phrasesChoisies.add(finaliserPhrase(phrase));
        tentatives++;
    }
    return Array.from(phrasesChoisies).join(' ');
}

export async function genereContent(
    sujet: FakerSubjects,
    categoryKey?: string,
    options?: ContentOptions
): Promise<{ title: string; description: string, elementRetenu: ElementSpecifique | undefined, image?: string }> {
    let titre: string = '';
    let description: string = '';
    let Element: ElementSpecifique | undefined = undefined;
    let categoryName: string | undefined;
    let baseTitre: string = piocherElement(titleWordsByKey[sujet] || titleWordsByKey.autre);
    baseTitre = baseTitre.replace(/:$/, '').trim();
    let image: string | undefined = undefined;
    const randomIndex = (length: number) => Math.floor(Math.random() * length)
    let needImage = false;
    const nombrePhrasesDescription = Math.floor(Math.random() * 3) + 2

    switch (sujet) {
        case FakerSubjects.EVENT: {
            needImage = true;
            const catKey = categoryKey ? categoryKey as EventCategory : piocherElement(Object.values(EventCategory).filter(k => k !== EventCategory.CATEGORY_5));
            categoryName = EventCategory[catKey as any]; // Pour l'affichage de la catégorie
            Element = piocherElement(eventElementsByCategory[catKey] || eventElementsByCategory[EventCategory.CATEGORY_5]);
            if (!Element) break; // Sécurité
            titre = `${baseTitre} : ${capitaliser(Element.nom)}`;
            if (options?.date) titre += ` ${options.date.startsWith("le ") ? options.date : "le " + options.date}`;
            if (options?.ville && Math.random() < 0.5) titre += ` à ${options.ville}`;
            let nousJe = (Math.random() < 0.5) ? 'Nous' : 'Je';
            let verb = nousJe === 'Nous' ? Element.verbe[randomIndex(Element.verbe.length)] : Element.verbeJe[randomIndex(Element.verbeJe.length)]
            let descIntro = `${nousJe} ${verb} ${Element.nom}`;
            if (options?.auteur && Math.random() < 0.3) descIntro = `${options.auteur} ${Element.verbe[randomIndex(Element.verbe.length)] || 'organise'} ${Element.nom}`;
            descIntro = finaliserPhrase(descIntro);
            description = descIntro + " " + genererPhrasesDescriptionCourte(eventContextPhrases, Element, options, nombrePhrasesDescription - 1);
            break;
        }
        case FakerSubjects.SERVICE: {
            needImage = true;
            const catKey = categoryKey ? categoryKey as ServiceCategory : piocherElement(Object.values(ServiceCategory).filter(k => k !== ServiceCategory.CATEGORY_5));
            categoryName = ServiceCategory[catKey as any];
            Element = piocherElement(serviceElementsByCategory[catKey] || serviceElementsByCategory[ServiceCategory.CATEGORY_5]);
            if (!Element) break;
            titre = `${capitaliser(Element.nom)} - ${baseTitre}`;
            if (options?.ville && Math.random() < 0.5) titre += ` (Secteur ${options.ville})`;
            let descIntro = `Je ${Element.verbe[randomIndex(Element.verbe.length)] || 'propose mes services pour'} ${Element.nom}`;
            if (options?.auteur && Math.random() < 0.3) descIntro = `${options.auteur} ${Element.verbe[randomIndex(Element.verbe.length)] || 'propose ses services pour'} ${Element.nom}`;
            descIntro = finaliserPhrase(descIntro);
            description = descIntro + " " + genererPhrasesDescriptionCourte(serviceContextPhrases, Element, options, nombrePhrasesDescription - 1);
            break;
        }
        case FakerSubjects.POST: {
            needImage = true;
            const catKey = categoryKey ? categoryKey as PostCategory : piocherElement(Object.values(PostCategory).filter(k => k !== PostCategory.CATEGORY_5));
            categoryName = PostCategory[catKey as any];
            Element = piocherElement(postElementsByCategory[catKey] || postElementsByCategory[PostCategory.CATEGORY_5]);
            if (!Element) break;
            const actionTitre = (catKey === PostCategory.CATEGORY_3) ? "À vendre" : (catKey === PostCategory.CATEGORY_4) ? "À donner" : (catKey === PostCategory.CATEGORY_1) ? (Element.verbe?.includes("perdu") ? "Perdu" : "Trouvé") : baseTitre;
            titre = `${actionTitre} ${capitaliser(Element.nom)}`;
            if (options?.ville && Math.random() < 0.7) titre += ` Vu à ${options.ville}`;

            let descIntro = `J'${Element.verbe[randomIndex(Element.verbe.length)] || 'annonce'} ${Element.nom}`;
            if (catKey === PostCategory.CATEGORY_1 && Element.verbe?.includes("trouvé")) {
                descIntro = `J'${Element.verbe[randomIndex(Element.verbe.length)] || 'ai trouvé'} ${Element.nom}`;
            }
            if (options?.auteur && Math.random() < 0.3) {
                const verbe = (catKey === PostCategory.CATEGORY_1 && Element.verbe?.includes("trouvé")) ?
                    (Element.verbe[randomIndex(Element.verbe.length)] || 'a trouvé') :
                    (Element.verbe[randomIndex(Element.verbe.length)] || 'annonce');
                descIntro = `${options.auteur} ${verbe} ${Element.nom}`;
            }
            descIntro = finaliserPhrase(descIntro);

            const contextSpecificPhrases = postContextPhrases[catKey] || postContextPhrases[PostCategory.CATEGORY_5];
            description = descIntro + " " + genererPhrasesDescriptionCourte(contextSpecificPhrases, Element, options, nombrePhrasesDescription - 1);
            break;
        }
        case FakerSubjects.SURVEY: {
            needImage = true;
            const catKey = categoryKey ? categoryKey as SurveyCategory : piocherElement(Object.values(SurveyCategory).filter(k => k !== SurveyCategory.CATEGORY_5));
            categoryName = SurveyCategory[catKey as any];
            Element = piocherElement(surveyElementsByCategory[catKey] || surveyElementsByCategory[SurveyCategory.CATEGORY_5]);
            if (!Element) break;
            titre = `${baseTitre} sur ${Element.nom}`;
            if (options?.ville && Math.random() < 0.3) titre += ` (Quartier ${options.ville})`;
            let jeNous = (Math.random() < 0.5) ? 'Nous' : 'Je';
            const verb = jeNous === 'Nous' ? Element.verbe[randomIndex(Element.verbe.length)] : Element.verbeJe[randomIndex(Element.verbeJe.length)];
            let descIntro = `${jeNous} ${verb} ${Element.nom}`;
            if (options?.auteur && Math.random() < 0.3) { // Si un groupe/asso est l'auteur
                descIntro = `${options.auteur} souhaite ${Element.verbe[randomIndex(Element.verbe.length)] || 'vous consulter sur'} ${Element.nom}`;
            }
            descIntro = finaliserPhrase(descIntro);
            description = descIntro + " " + genererPhrasesDescriptionCourte(surveyContextPhrases, Element, options, nombrePhrasesDescription - 1);
            break;
        }
        case FakerSubjects.GROUP: {
            needImage = false
            const catKey = categoryKey ? categoryKey as GroupCategory : piocherElement(Object.values(GroupCategory).filter(k => k !== GroupCategory.CATEGORY_5));
            categoryName = GroupCategory[catKey as any];
            Element = piocherElement(groupElementsByCategory[catKey] || groupElementsByCategory[GroupCategory.CATEGORY_5]);
            if (!Element) break;
            titre = `${capitaliser(Element.nom)} `//: ${baseTitre}`;
            if (options?.ville && Math.random() < 0.5) titre += ` à ${options.ville}`;
            let descIntro = `Notre collectif ${Element.verbe[randomIndex(Element.verbe.length)] || 'vous invite à rejoindre'} ${Element.nom}`;
            if (options?.auteur && Math.random() < 0.3) {
                descIntro = `${options.auteur} ${Element.verbe[randomIndex(Element.verbe.length)] || 'vous invite à rejoindre'} ${Element.nom}`;
            }
            descIntro = finaliserPhrase(descIntro);
            description = descIntro + " " + genererPhrasesDescriptionCourte(groupContextPhrases, Element, options, nombrePhrasesDescription - 1);
            break;
        }
        case FakerSubjects.POOL: {
            needImage = false
            Element = { nom: piocherElement(poolSubjects), verbe: poolActions };
            titre = `${baseTitre} pour ${Element.nom}`;
            if (options?.ville && Math.random() < 0.3) titre += ` (Initiative de ${options.ville})`;

            let descIntro = `Nous ${Element.verbe[randomIndex(Element.verbe.length)] || 'lançons une cagnotte pour'} ${Element.nom}`;
            if (options?.auteur && Math.random() < 0.3) {
                descIntro = `${options.auteur} ${Element.verbe[randomIndex(Element.verbe.length)] || 'lance une cagnotte pour'} ${Element.nom}`;
            }
            descIntro = finaliserPhrase(descIntro);
            description = descIntro + " " + genererPhrasesDescriptionCourte(poolContextPhrases, Element, options, nombrePhrasesDescription - 1);
            break;
        }
        case FakerSubjects.MESSAGE: {
            needImage = false
            const randomTopic = piocherElement(linkWords.concat(Object.values(titleWordsByKey).flat().map(s => s.toLowerCase().split(' ')[0]))) || "une info";
            titre = `${baseTitre} : ${randomTopic}`;
            if (options?.auteur && Math.random() < 0.5) titre = `Message de ${options.auteur} concernant ${randomTopic}`;
            // Pour message, on prend directement depuis motsTexteMessage
            const intro = piocherElement(motsTexteMessage.intro);
            const corps1 = piocherElement(motsTexteMessage.corps);
            const corps2 = piocherElement(motsTexteMessage.corps);
            const conclusion = piocherElement(motsTexteMessage.conclusion);
            let phrases = [intro, corps1];
            if (Math.random() > 0.3) phrases.push(corps2);
            if (Math.random() > 0.5) phrases.push(conclusion);
            description = phrases.map(p => finaliserPhrase(p)).join(' ').trim();
            // Assurer une description minimale
            if (description.length < 20) description = `${finaliserPhrase(intro as string)} ${finaliserPhrase(corps1 as string)} ${finaliserPhrase(conclusion as string)}`;
            Element = { nom: randomTopic }; // Pas de verbe ou détails spécifiques pour message simple
            break;
        }
        case FakerSubjects.AUTRE:
        default: {
            needImage = false
            const randomSujetAutre = piocherElement(Object.values(titleWordsByKey).flat());
            Element = { nom: `un sujet (${randomSujetAutre.toLowerCase()})`, verbe: ["aimerions partager une information sur", "voudrions partager à propos de"] };
            titre = `${baseTitre} : ${randomSujetAutre}`;
            if (options?.ville && Math.random() < 0.5) titre += ` (Infos ${options.ville})`;
            description = `${finaliserPhrase(`Nous ${Element.verbe} ${Element.nom}`)} ${finaliserPhrase(piocherElement(eventContextPhrases))}`; // Réutiliser eventContext pour varier
            if (description.length < 30) description = finaliserPhrase(`${randomSujetAutre} concernant un sujet divers qui pourrait intéresser la communauté à [ville].`);
            if (options?.ville) description = description.replace(/\[ville\]/g, options.ville);
            break;
        }
    }
    // Fallback si titre ou description sont vides (ne devrait pas arriver avec les sécurités)
    if (!titre) titre = capitaliser(baseTitre + (Element ? `: ${Element.nom}` : " important"));
    if (!description) description = `Plus d'informations à venir concernant ${Element ? Element.nom : sujet}. Restez connectés !`
    if (needImage) {
        const keyWord = (Element?.nom.split(' ')).filter(word => word.length > 2 && !linkWords.includes(word))
        let keySentence = keyWord.length > 0 ? keyWord.join(' ') : ''
        keySentence ? keySentence = await translate(keySentence, 'en') : keySentence = '';

        console.log(`Key sentence for image search: ${keySentence}`);
        const keyWords: string[] = keySentence
            .split(' ')
            //.filter(word => /^[a-zA-Z0-9]+$/.test(word))
            .slice(0, 3);
        keyWords.push(FakerSubjects[sujet.toLowerCase()]);
        image = await getRandomPixabayImageUrl(process.env.PIXABAY_API_KEY, keyWords)
    }
    return {
        image: image,
        title: capitaliser(titre.trim().replace(/\s+/g, ' ').substring(0, 80)),
        description: description.trim(),
        elementRetenu: Element
    };
}


// --- TESTS/EXAMPLES ---
async function testGenerateur() {

    const sujetsATester = [
        FakerSubjects.EVENT, FakerSubjects.SERVICE, FakerSubjects.POST,
        FakerSubjects.SURVEY, FakerSubjects.GROUP, FakerSubjects.POOL,
        FakerSubjects.MESSAGE, FakerSubjects.AUTRE
    ];

    const quelquesCategoriesParSujet = {
        [FakerSubjects.EVENT]: [EventCategory.CATEGORY_1, EventCategory.CATEGORY_2, undefined],
        [FakerSubjects.SERVICE]: [ServiceCategory.CATEGORY_1, ServiceCategory.CATEGORY_4, undefined],
        [FakerSubjects.POST]: [PostCategory.CATEGORY_3, PostCategory.CATEGORY_1, PostCategory.CATEGORY_4, undefined],
        [FakerSubjects.SURVEY]: [SurveyCategory.CATEGORY_1, SurveyCategory.CATEGORY_4, undefined],
        [FakerSubjects.GROUP]: [GroupCategory.CATEGORY_1, GroupCategory.CATEGORY_4, undefined],
        [FakerSubjects.POOL]: [undefined], // Pas de sous-catégories
        [FakerSubjects.MESSAGE]: [undefined],
        [FakerSubjects.AUTRE]: [undefined],
    };

    const optionsExemple: ContentOptions = {
        auteur: "L'équipe d'animation du quartier",
        ville: "Marseille",
        date: "samedi prochain",
    };

    sujetsATester.forEach(sujet => {
        console.log(`\n--- Sujet: ${capitaliser(sujet)} ---`);
        const categoriesPourCeSujet = quelquesCategoriesParSujet[sujet];

        categoriesPourCeSujet.forEach(async catKey => {
            const resultat = await genereContent(sujet, catKey, optionsExemple);
            let infoCat = catKey ? ` (Catégorie testée: ${catKey})` : ' (Catégorie aléatoire/fallback)';
            if (sujet === FakerSubjects.POOL || sujet === FakerSubjects.MESSAGE || sujet === FakerSubjects.AUTRE) infoCat = '';

            console.log(`\n## ${capitaliser(sujet)}${infoCat} ##`);
            console.log('Élément retenu:', resultat.elementRetenu?.nom);
            console.log('Titre:', resultat.title);
            console.log('Description:', resultat.description);
        });
        console.log('-------------------------------');
    });

}

testGenerateur();
