import { newFaker } from '../../prisma/seed';
import { getRandomPixabayImageUrl } from './seedImage';
import translate from "translate";

translate.engine = 'google';
translate.key = process.env.GOOGLE_API_KEY || '';

/**
 * --- ENUMS ---
 */
export enum FakerSubjects {
    EVENT = 'event',
    SERVICE = 'service',
    POST = 'post',
    POOL = 'pool',
    SURVEY = 'survey',
    GROUP = 'group',
    MESSAGE = 'message',
    AUTRE = 'autre',
    ISSUE = 'litige'
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

/**
 * --- INTERFACES POUR DONNÉES STRUCTURÉES ---
 */
interface ElementSpecifique {
    nom: string;
    adjectif?: string[]
    verbe?: string[];
    verbeRev?: string[];
    detailsSpecifiques?: string[];
}

export interface ContentOptions {
    auteur?: string;
    ville?: string;
    date?: string;
}

/**
 * --- DATA ---
 * Les préfixes et suffixes sont maintenant organisés par sous-catégorie pour event, service, post, survey.
*/

interface TitleWords {
    event: Record<EventCategory, { pref: string[]; suf: string[] }>;
    service: Record<ServiceCategory, { pref: string[]; suf: string[] }>;
    post: Record<PostCategory, { pref: string[]; suf: string[] }>;
    survey: Record<SurveyCategory, { pref: string[]; suf: string[] }>;
    group: { pref: string[]; suf: string[] };
    pool: { pref: string[]; suf: string[] };
    message: { pref: string[]; suf: string[] };
    autre: { pref: string[]; suf: string[] };
}
const titleWords: TitleWords = {
    event: {
        [EventCategory.CATEGORY_1]: {
            pref: [
                'Sport :',
                'Participez à',
                'Rendez-vous sportif',
                'Challenge',
                'Bougez avec nous',
                'Annonce sportive',
                'Venez jouer',
                'Tournoi',
                'Match',
                'Séance',
                'Balade',
                'Randonnée'
            ],
            suf: [
                'vous attend',
                'au programme',
                'pour tous',
                'à découvrir',
                'à ne pas manquer',
                'ce week-end',
                'bientôt',
                'dans le quartier'
            ]
        },
        [EventCategory.CATEGORY_2]: {
            pref: [
                'Convivial :',
                'Partage :',
                'Événement social',
                'Rencontre',
                'Soirée',
                'Apéro',
                'Pique-nique',
                'Fête',
                'Atelier',
                'Brunch',
                'Goûter',
                'Brocante'
            ],
            suf: [
                'pour partager',
                'pour tous',
                'à découvrir',
                'à ne pas manquer',
                'dans le quartier',
                'ensemble',
                'bientôt'
            ]
        },
        [EventCategory.CATEGORY_3]: {
            pref: [
                'Culture :',
                'Découverte :',
                'Exposition',
                'Atelier',
                'Visite',
                'Projection',
                'Café',
                'Participez à',
                'Rendez-vous culturel',
                'Annonce culturelle'
            ],
            suf: [
                'vous attend',
                'pour les curieux',
                'à explorer',
                'à découvrir',
                'dans le quartier',
                'bientôt'
            ]
        },
        [EventCategory.CATEGORY_4]: {
            pref: [
                'Musique :',
                'Concert',
                'Scène musicale',
                'Chorale',
                'Blind test',
                'Participez à',
                'Rendez-vous musical',
                'Vibrez avec nous',
                'Annonce musicale'
            ],
            suf: [
                'en musique',
                'pour tous',
                'à découvrir',
                'à ne pas manquer',
                'dans le quartier',
                'bientôt'
            ]
        },
        [EventCategory.CATEGORY_5]: {
            pref: [
                'Invitation :',
                'Participez :',
                'Rendez-vous :',
                'Annonce :',
                'Marché',
                'Nettoyage',
                'Concours',
                'Vide-grenier',
                'Projet',
                'Initiative'
            ],
            suf: [
                'vous attend',
                'pour vous',
                'à découvrir',
                'à ne pas manquer',
                'dans le quartier',
                'bientôt'
            ]
        }
    },
    service: {
        [ServiceCategory.CATEGORY_1]: {
            pref: [
                'Bricolage :',
                'Aide travaux',
                'Entretien',
                'Jardinage',
                'Je propose',
                'Service maison',
                'Petits travaux',
                'Réparation'
            ],
            suf: [
                'proposé',
                'disponible',
                'à saisir',
                'dans le quartier',
                'pour vous',
                'à réserver'
            ]
        },
        [ServiceCategory.CATEGORY_2]: {
            pref: [
                'Cours :',
                'Soutien scolaire',
                'Initiation',
                'Formation',
                'Atelier langue',
                'Aide devoirs',
                'Je propose'
            ],
            suf: [
                'disponible',
                'à découvrir',
                'pour tous',
                'dans le quartier',
                'à réserver'
            ]
        },
        [ServiceCategory.CATEGORY_3]: {
            pref: [
                'Animaux :',
                'Garde',
                'Promenade',
                'Service animalier',
                'Je propose',
                'Aide animaux'
            ],
            suf: [
                'proposé',
                'disponible',
                'pour vos animaux',
                'dans le quartier'
            ]
        },
        [ServiceCategory.CATEGORY_4]: {
            pref: [
                'Enfants :',
                'Aide',
                'Soutien',
                'Baby-sitting',
                'Garde enfants',
                'Je propose'
            ],
            suf: [
                'proposé',
                'disponible',
                'pour vos enfants',
                'dans le quartier'
            ]
        },
        [ServiceCategory.CATEGORY_5]: {
            pref: [
                'Service :',
                'Entraide',
                'Aide',
                'Partage',
                'Je propose',
                'Coup de main'
            ],
            suf: [
                'proposé',
                'disponible',
                'pour tous',
                'dans le quartier'
            ]
        }
    },
    post: {
        [PostCategory.CATEGORY_1]: {
            pref: [
                'Perdu/trouvé :',
                'Annonce :',
                'À signaler',
                'Objet perdu',
                'Objet trouvé',
                'Recherche',
                'Signalement'
            ],
            suf: [
                'signalé',
                'à retrouver',
                'dans le quartier',
                'urgent',
                'merci de partager'
            ]
        },
        [PostCategory.CATEGORY_2]: {
            pref: [
                'Animal :',
                'Adoption',
                'À donner',
                'À adopter',
                'Recherche famille',
                'Don animalier'
            ],
            suf: [
                'à adopter',
                'à donner',
                'disponible',
                'dans le quartier'
            ]
        },
        [PostCategory.CATEGORY_3]: {
            pref: [
                'À vendre :',
                'Vente',
                'Bon plan',
                'Occasion',
                'Annonce vente',
                'À saisir'
            ],
            suf: [
                'à vendre',
                'disponible',
                'à saisir',
                'dans le quartier'
            ]
        },
        [PostCategory.CATEGORY_4]: {
            pref: [
                'À donner :',
                'Don',
                'Gratuit',
                'À récupérer',
                'Annonce don'
            ],
            suf: [
                'à donner',
                'à récupérer',
                'disponible',
                'dans le quartier'
            ]
        },
        [PostCategory.CATEGORY_5]: {
            pref: [
                'Info :',
                'Annonce',
                'À signaler',
                'Service',
                'À partager'
            ],
            suf: [
                'à lire',
                'à partager',
                'important',
                'dans le quartier'
            ]
        }
    },
    survey: {
        [SurveyCategory.CATEGORY_1]: {
            pref: [
                'Avis :',
                'Sondage',
                'Question',
                'Votre avis',
                'Consultation'
            ],
            suf: [
                'lancé',
                'ouvert',
                'à donner',
                'important'
            ]
        },
        [SurveyCategory.CATEGORY_2]: {
            pref: [
                'Projet :',
                'Sondage',
                'Avis',
                'Consultation',
                'Votre avis'
            ],
            suf: [
                'lancé',
                'ouvert',
                'à donner',
                'important'
            ]
        },
        [SurveyCategory.CATEGORY_3]: {
            pref: [
                'Opinion :',
                'Sondage',
                'Avis',
                'Votre opinion',
                'Consultation'
            ],
            suf: [
                'lancé',
                'ouvert',
                'à donner',
                'important'
            ]
        },
        [SurveyCategory.CATEGORY_4]: {
            pref: [
                'Organisation :',
                'Sondage',
                'Avis',
                'Votre avis',
                'Consultation'
            ],
            suf: [
                'lancé',
                'ouvert',
                'à donner',
                'important'
            ]
        },
        [SurveyCategory.CATEGORY_5]: {
            pref: [
                'Projet :',
                'Sondage',
                'Avis',
                'Votre avis',
                'Consultation'
            ],
            suf: [
                'lancé',
                'ouvert',
                'à donner',
                'important'
            ]
        }
    },
    group: {
        pref: [
            'Groupe :',
            'Communauté',
            'Collectif',
            'Club',
            'Association',
            'Participez',
            'Rejoignez-nous'
        ],
        suf: [
            'vous attend',
            'ouvert à tous',
            'dans le quartier',
            'ensemble'
        ]
    },
    pool: {
        pref: [
            'Cagnotte :',
            'Soutien',
            'Solidarité',
            'Collecte',
            'Projet solidaire'
        ],
        suf: [
            'lancée',
            'ouverte',
            'pour tous',
            'dans le quartier'
        ]
    },
    message: {
        pref: [
            'Message :',
            'Info',
            'Annonce',
            'À lire',
            'À partager'
        ],
        suf: [
            'à lire',
            'à partager',
            'important',
            'dans le quartier'
        ]
    },
    autre: {
        pref: [
            'Info :',
            'Annonce',
            'À noter',
            'À savoir',
            'À partager'
        ],
        suf: [
            'à lire',
            'à partager',
            'important',
            'dans le quartier'
        ]
    }
};

const linkWords = [
    'et', 'ou', 'mais', 'donc', 'ni', 'car', 'aussi', 'alors', 'ainsi', 'cependant', 'pourtant', 'toutefois', 'néanmoins', 'en effet', 'quand', 'lorsque', 'comme', 'si', 'puisque', 'parce que', 'afin de', 'pour que', 'afin que', 'bien que', 'pendant que', 'à', 'de', 'en', 'pour', 'par', 'sur', 'sous', 'avec', 'sans', 'chez', 'vers', 'dans', 'concernant', 'autour de', 'malgré', 'par exemple', 'c\'est-à-dire', 'notamment', 'surtout', 'également', 'non seulement', 'mais aussi', 'au sein de', 'l`'
];

const wordToExclude = [
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de la', 'l`', 'l\'', 'de l\'', 'd\'', 'et', 'ou', 'mais', 'donc', 'car', 'aide', 'aider', 'initiation', 'projet', 'projets',
    'aussi', 'alors', 'ainsi', 'cependant', 'autre', 'atelier', 'ateliers',
    'bon', 'état', 'vendre', 'donner', 'perdu', 'trouvé', 'à vendre', 'à donner', 'perdu/trouvé', 'aux', 'à', 'de', 'en', 'pour', 'par', 'sur', 'matinale', 'soirée', 'journée', 'week-end', 'semaine', 'mois', 'tous'
]

// --- ÉLÉMENTS SPÉCIFIQUES PAR CATÉGORIE ---
// ÉVÉNEMENTS
const eventElementsByCategory: Record<EventCategory, ElementSpecifique[]> = {
    [EventCategory.CATEGORY_1]: [ // Sport
        {
            nom: 'un match',
            adjectif: ['de rugby amical', 'de foot enfants', 'de foot en salle', 'de foot régional'],
            verbe: ['nous organisons', 'nous lançons', 'nous proposons', 'j\'organise', 'je lance', 'je propose'],
            verbeRev: ['est organisé', 'est lancé', 'est proposé'],
            detailsSpecifiques: ['sur le terrain municipal', 'ouvert à tous les niveaux de jeu', 'équipes à former sur place, dans la bonne humeur']
        },
        {
            nom: 'une course',
            adjectif: ['à pied conviviale', 'à vélo sportive', 'ouverte à tous', 'de 5km', 'de 10km'],
            verbe: ['nous lançons', 'nous organisons', 'nous proposons', 'je lance', 'j\'organise', 'je propose'],
            verbeRev: ['est lancée', 'est organisée', 'est proposée'],
            detailsSpecifiques: ['parcours en boucle dans le parc', 'ravitaillement en eau prévu à mi-parcours', 'pour coureurs débutants et confirmés', 'départ à 9h30 sur la Corniche']
        },
        {
            nom: 'une séance',
            adjectif: ['de yoga en plein air', 'de pilates détente', 'de crossfit matinale'],
            verbe: ['nous proposons', 'nous organisons', 'nous lançons', 'je propose', 'j\'organise', 'je lance', 'je voudrais mettre en place'],
            verbeRev: ['est proposée', 'est organisée', 'est lancée', 'est mise en place'],
            detailsSpecifiques: ['au lever du soleil, dans un cadre verdoyant du parc', 'apportez votre tapis et une tenue confortable', 'moment de détente et de bien-être assuré', 'à la plage de la ville', 'rendez-vous à 7h30']
        },
        {
            nom: 'un tournoi',
            adjectif: ['de pétanque amical', 'de foot amical intercités', 'de tennis local'],
            verbe: ['nous mettons en place', 'nous organisons', 'nous lançons', 'je mets en place', 'j\'organise', 'je lance'],
            verbeRev: ['est mis en place', 'est organisé', 'est lancé'],
            detailsSpecifiques: ['au boulodrome municipal ombragé', 'inscriptions par doublette ou triplette', 'ambiance garantie, buvette sur place']
        },
        {
            nom: 'une randonnée',
            adjectif: ['découverte nature', 'à cheval familiale', 'guidée des sentiers'],
            verbe: ['nous organisons', 'nous lançons', 'nous proposons', 'j\'organise', 'je lance', 'je propose'],
            verbeRev: ['est organisée', 'est lancée', 'est proposée'],
            detailsSpecifiques: ['sur les sentiers forestiers environnants (environ 8km)', 'prévoir bonnes chaussures, eau et petit encas', 'niveau facile à moyen, encadrée par un animateur']
        },
        {
            nom: 'une initiation',
            adjectif: ['au tennis débutant', 'à la conduite sportive', 'aux échecs gratuite'],
            verbe: ['nous proposons', 'nous lançons', 'nous organisons', 'je propose', 'j\'organise', 'je lance'],
            verbeRev: ['est proposée', 'est lancée', 'est organisée'],
            detailsSpecifiques: ['sur les courts municipaux en accès libre', 'prêt de matériel possible (stock limité)', 'séance découverte encadrée par un bénévole', 'au gymnase du quartier', 'à 14h00']
        },
        {
            nom: 'un atelier stretching',
            adjectif: ['relaxant', 'collectif', 'accessible'],
            verbe: ['nous lançons', 'nous proposons', 'nous organisons', 'je lance', 'je propose', 'j\'organise'],
            verbeRev: ['est lancé', 'est proposé', 'est organisé'],
            detailsSpecifiques: ['pour tous niveaux, idéal après l\'effort ou pour se détendre', 'en extérieur par beau temps, sinon dans une salle couverte', 'apportez une serviette et une bouteille d\'eau']
        },
        {
            nom: 'une balade',
            adjectif: ['à vélo familiale', 'en moto pour débutant', 'en VTT sportive'],
            verbe: ['nous organisons', 'nous proposons', 'participez à', 'j\'organise', 'je propose', 'participez à'],
            verbeRev: ['est organisée', 'est proposée'],
            detailsSpecifiques: ['parcours familial adapté (environ 10-15km)', 'sécurité : casque et gilet fluo fortement recommandés', 'rendez-vous au grand chêne du parc, départ en matinée', 'à 10h00']
        },
        {
            nom: 'un tournoi',
            adjectif: ['de foot urbain', 'de basket convivial', 'de pétanque dynamique'],
            verbe: ['nous lançons', 'nous organisons', 'inscrivez-vous à', 'je lance', 'j\'organise', 'inscrivez-vous à'],
            verbeRev: ['est lancé', 'est organisé'],
            detailsSpecifiques: ['sur le city stade du quartier des Oliviers', 'équipes de 3 ou 4 joueurs, mixtes bienvenues', 'inscription gratuite sur place, petits lots pour les vainqueurs']
        }
    ],
    [EventCategory.CATEGORY_2]: [ // Social
        {
            nom: 'un apéro',
            adjectif: ['des voisins convivial', 'partagé', 'informel'],
            verbe: ['nous organisons', 'nous lançons', 'nous proposons', 'j\'organise', 'je lance', 'je propose'],
            verbeRev: ['est organisé', 'est lancé', 'est proposé'],
            detailsSpecifiques: ['chacun apporte quelque chose à boire ou à grignoter', 'pour mieux se connaître et échanger simplement', 'devant la résidence ou au parc voisin']
        },
        {
            nom: 'un pique-nique',
            adjectif: ['participatif', 'familial', 'en plein air'],
            verbe: ['nous proposons', 'nous lançons', 'nous organisons', 'je propose', 'je lance', 'j\'organise'],
            verbeRev: ['est proposé', 'est lancé', 'est organisé'],
            detailsSpecifiques: ['au parc central de la ville, près du lac', 'apportez votre nappe, panier repas et votre bonne humeur', 'jeux pour enfants et musique d\'ambiance bienvenus']
        },
        {
            nom: 'une soirée',
            adjectif: ['jeux de société ludique', 'de partage intergénérationnelle', 'karaoké conviviale'],
            verbe: ['nous animons', 'nous organisons', 'nous lançons', 'nous proposons', 'j\'anime', 'j\'organise', 'je lance', 'je propose'],
            verbeRev: ['est animée', 'est organisée', 'est lancée', 'est proposée'],
            detailsSpecifiques: ['à la salle commune municipale ou dans un café partenaire', 'apportez vos jeux préférés, tous les âges sont conviés', 'boissons et grignotages sur place (participation libre appréciée)']
        },
        {
            nom: 'un atelier',
            adjectif: ['cuisine du monde', 'de poterie créatif', 'pâtisserie gourmande'],
            verbe: ['nous lançons', 'nous proposons', 'nous organisons', 'nous animons', 'je lance', 'je propose', 'j\'organise', 'j\'anime'],
            verbeRev: ['est lancé', 'est proposé', 'est organisé', 'est animé'],
            detailsSpecifiques: ['thème : "Saveurs d\'Italie" pour cette session', 'inscription nécessaire (places limitées)', 'on cuisine ensemble puis on déguste nos préparations']
        },
        {
            nom: 'une fête de quartier',
            adjectif: ['festive', 'locale', 'annuelle'],
            verbe: ['nous préparons', 'nous organisons', 'nous lançons', 'je prépare', 'j\'organise', 'je lance'],
            verbeRev: ['est préparée', 'est organisée', 'est lancée'],
            detailsSpecifiques: ['musique live, stands associatifs, animations pour enfants', 'pour célébrer le vivre-ensemble et la convivialité locale', 'sur la place du marché rénovée, toute la journée']
        },
        {
            nom: 'un brunch',
            adjectif: ['matinal', 'gourmand', 'détendu'],
            verbe: ['nous lançons', 'nous proposons', 'nous organisons', 'je lance', 'je propose', 'j\'organise'],
            verbeRev: ['est lancé', 'est proposé', 'est organisé'],
            detailsSpecifiques: ['chacun apporte un plat sucré ou salé à partager', 'moment convivial pour bien commencer la journée du dimanche', 'au parc ou à la salle polyvalente si mauvais temps']
        },
        {
            nom: 'une activité',
            adjectif: ['décoration créative', 'jeux participatif', 'artisanat thématique'],
            verbe: ['nous proposons', 'nous lançons', 'nous organisons', 'je propose', 'je lance', 'j\'organise'],
            verbeRev: ['est proposée', 'est lancée', 'est organisée'],
            detailsSpecifiques: ['préparation des décorations de la saison', 'matériel de base fourni, apportez vos idées', 'ouvert à tous, enfants accompagnés bienvenus']
        },
        {
            nom: 'un goûter',
            adjectif: ['pour tous les âges', 'convivial', 'chaleureux'],
            verbe: ['nous organisons', 'nous proposons', 'participez à', 'j\'organise', 'je propose', 'participez à'],
            verbeRev: ['est organisé', 'est proposé'],
            detailsSpecifiques: ['chacun amène gâteaux faits maison, boissons ou fruits de saison', 'dans le jardin de la résidence ou la salle commune', 'pour un après-midi de détente et d\'échanges']
        },
        {
            nom: 'une brocante',
            adjectif: ['solidaire à petit prix', 'avec des artisans locaux', 'géante annuelle'],
            verbe: ['nous mettons en place', 'nous organisons', 'participez à', 'je mets en place', 'j\'organise', 'participez à'],
            verbeRev: ['est mise en place', 'est organisée'],
            detailsSpecifiques: ['dépôt des articles en bon état le matin, vente l\'après-midi', 'à la salle des fêtes municipale', 'une seconde vie pour les affaires, bonnes affaires pour tous']
        }
    ],
    [EventCategory.CATEGORY_3]: [ // Culturel
        {
            nom: 'une exposition',
            adjectif: ['de peintures artistiques', 'de sculptures gratuites', 'historique et variée'],
            verbe: ['nous accueillons', 'nous organisons', 'nous lançons', 'j\'accueille', 'j\'organise', 'je lance'],
            verbeRev: ['est accueillie', 'est organisée', 'est lancée'],
            detailsSpecifiques: ['artistes du quartier à l\'honneur', 'vernissage en début de mois', 'entrée libre à la galerie municipale']
        },
        {
            nom: 'un atelier',
            adjectif: ['d\'écriture littéraire', 'inspirant', 'participatif'],
            verbe: ['nous animons', 'nous proposons', 'nous lançons', 'j\'anime', 'je propose', 'je lance'],
            verbeRev: ['est animé', 'est proposé', 'est lancé'],
            detailsSpecifiques: ['pour adultes et adolescents', 'thème : "Souvenirs d\'enfance" ou écriture libre', 'à la bibliothèque municipale, sur inscription']
        },
        {
            nom: 'une visite',
            adjectif: ['guidée du patrimoine', 'des sites emblématiques', 'commentée'],
            verbe: ['nous proposons', 'nous lançons', 'nous organisons', 'je propose', 'je lance', 'j\'organise'],
            verbeRev: ['est proposée', 'est lancée', 'est organisée'],
            detailsSpecifiques: ['découverte de l\'histoire locale avec un guide', 'inscription recommandée, places limitées', 'départ devant l\'Office de Tourisme']
        },
        {
            nom: 'une projection de film',
            adjectif: ['familiale', 'en plein air', 'gratuite'],
            verbe: ['nous organisons', 'nous proposons', 'assistez à', 'j\'organise', 'je propose', 'assistez à'],
            verbeRev: ['est organisée', 'est proposée'],
            detailsSpecifiques: ['film d\'animation grand public', 'au parc à la tombée de la nuit', 'apportez couvertures, chaises pliantes et pique-nique']
        },
        {
            nom: 'un café',
            adjectif: ['philosophique', 'participatif', 'créatif'],
            verbe: ['nous lançons', 'nous animons', 'participez à', 'je lance', 'j\'anime', 'participez à'],
            verbeRev: ['est lancé', 'est animé'],
            detailsSpecifiques: ['thème du jour : "Le bonheur est-il un objectif ou un chemin?"', 'au café ou à la médiathèque', 'débat animé par un modérateur, respect et écoute mutuelle']
        }
    ],
    [EventCategory.CATEGORY_4]: [ // Musique
        {
            nom: 'un concert',
            adjectif: ['de piano intimiste', 'de guitare locale', 'acoustique gratuit', 'de jazz'],
            verbe: ['nous organisons', 'nous proposons', 'venez écouter', 'j\'organise', 'je propose', 'venez écouter'],
            verbeRev: ['est organisé', 'est proposé'],
            detailsSpecifiques: ['artistes locaux en duo ou trio', 'dans le jardin de la bibliothèque ou un lieu chaleureux', 'ambiance détendue, participation au chapeau']
        },
        {
            nom: 'une scène musicale',
            adjectif: ['participative', 'improvisée', 'éclectique'],
            verbe: ['nous lançons', 'nous animons', 'participez à', 'je lance', 'j\'anime', 'participez à'],
            verbeRev: ['est lancée', 'est animée'],
            detailsSpecifiques: ['ouverte à tous les musiciens et chanteurs', 'matériel de base sur place, apportez vos instruments', 'au bar associatif ou à la salle municipale']
        },
        {
            nom: 'une chorale',
            adjectif: ['participative', 'de l\'école', 'joyeuse', 'ouverte à tous'],
            verbe: ['nous créons', 'nous vous invitons à rejoindre', 'chantez avec', 'je crée', 'je vous invite à rejoindre', 'chantez avec'],
            verbeRev: ['est créée', 'est rejointe', 'est chantée'],
            detailsSpecifiques: ['apprentissage de chants populaires', 'aucune connaissance musicale requise', 'répétitions à la Maison Pour Tous, restitution publique en fin de cycle']
        },
        {
            nom: 'un blind test',
            adjectif: ['géant', 'ludique', 'musical', 'par équipes'],
            verbe: ['nous organisons', 'nous vous convions à', 'testez vos connaissances lors de', 'j\'organise', 'je vous convie à', 'testez vos connaissances lors de'],
            verbeRev: ['est organisé', 'est convié', 'est testé'],
            detailsSpecifiques: ['équipes de 4 à 6 personnes à former sur place', 'tous styles musicaux, des classiques aux hits actuels', 'nombreux lots pour les équipes gagnantes']
        }
    ],
    [EventCategory.CATEGORY_5]: [ // Autre
        {
            nom: 'un vide-grenier',
            adjectif: ['annuel', 'local', 'convivial', 'participatif'],
            verbe: ['nous organisons', 'nous lançons les inscriptions pour', 'participez à', 'j\'organise', 'je lance les inscriptions pour', 'participez à'],
            verbeRev: ['est organisé', 'est lancé', 'est inscrit'],
            detailsSpecifiques: ['sur la place du marché ou dans les rues piétonnes', 'inscriptions pour les exposants en mairie', 'buvette et petite restauration sur place']
        },
        {
            nom: 'un marché',
            adjectif: ['de Noël artisanal', 'aux fleurs estivale', 'de créateurs locaux', 'de fruits et légumes'],
            verbe: ['nous préparons', 'nous organisons', 'exposez à', 'je prépare', 'j\'organise', 'exposez à'],
            verbeRev: ['est préparé', 'est organisé', 'est exposé'],
            detailsSpecifiques: ['artisans et créateurs de la région', 'idées cadeaux originales, gourmandises de saison', 'sur la place de la Mairie, durant deux week-ends']
        },
        {
            nom: 'un nettoyage',
            adjectif: ['écologique', 'participatif', 'des jardins', 'de printemps utile'],
            verbe: ['nous organisons', 'nous vous invitons à', 'participons ensemble à', 'j\'organise', 'je vous invite à', 'participez à'],
            verbeRev: ['est organisé', 'est invité', 'est participé'],
            detailsSpecifiques: ['nettoyage des parcs publics et rues principales', 'matériel fourni par la municipalité', 'rendez-vous devant la mairie à 9h, pot de l\'amitié offert à midi']
        },
        {
            nom: 'un concours',
            adjectif: ['de beauté', 'de mangeurs de tacos', 'de déguisements créatif'],
            verbe: ['nous lançons', 'nous organisons', 'participez à', 'je lance', 'j\'organise', 'participez à'],
            verbeRev: ['est lancé', 'est organisé', 'est participé'],
            detailsSpecifiques: ['thème : "Personnages de contes et légendes" ou thème libre', 'catégories enfants et adultes, jury et prix pour les meilleurs', 'défilé en musique et remise des prix sur la place de la Fontaine']
        }
    ]
};
/**
 * SERVICES
 * Les noms sont génériques, les adjectifs précisent la sous-catégorie, verbes et détails sont adaptés.
 */
const serviceElementsByCategory: Record<ServiceCategory, ElementSpecifique[]> = {
    [ServiceCategory.CATEGORY_1]: [
        {
            nom: 'du bricolage',
            adjectif: ['en plomberie', 'en maçonnerie', 'en menuiserie', 'en électricité', 'petits travaux'],
            verbe: ['je propose', 'je réalise', 'j\'effectue', 'nous proposons', 'nous réalisons'],
            verbeRev: ['est proposé', 'est réalisé', 'est effectué', 'est assuré', 'est pris en charge'],
            detailsSpecifiques: [
                'montage de meubles, pose d\'étagères',
                'petites réparations diverses à domicile',
                'outillage fourni, intervention rapide',
                'disponible en semaine et week-end'
            ]
        },
        {
            nom: 'l\'entretien',
            adjectif: ['de jardin', 'des espaces verts', 'des plantes', 'des arbres', 'extérieur'],
            verbe: ['je propose', 'j\'effectue', 'je réalise', 'nous proposons', 'nous effectuons'],
            verbeRev: ['est proposé', 'est effectué', 'est réalisé', 'est assuré', 'est pris en charge'],
            detailsSpecifiques: [
                'tonte de pelouse, taille de haies',
                'désherbage, petits travaux paysagers',
                'entretien régulier ou ponctuel',
                'matériel de base fourni'
            ]
        },
        {
            nom: 'de l\'aide',
            adjectif: ['au déménagement', 'au transport', 'ponctuelle', 'pour travaux lourds'],
            verbe: ['je propose', 'j\'offre', 'je facilite', 'nous proposons', 'nous facilitons'],
            verbeRev: ['est proposée', 'est offerte', 'est facilitée', 'est assurée', 'est prise en charge'],
            detailsSpecifiques: [
                'porter des cartons, charger un véhicule',
                'aide ponctuelle selon vos besoins',
                'bonne humeur garantie',
                'véhicule utilitaire possible'
            ]
        }
    ],
    [ServiceCategory.CATEGORY_2]: [
        {
            nom: 'des cours',
            adjectif: ['de soutien scolaire', 'de maths', 'de français', 'd\'anglais', 'pour collège/lycée'],
            verbe: ['je donne', 'je propose', 'j\'accompagne', 'nous donnons', 'nous accompagnons'],
            verbeRev: ['est donné', 'est proposé', 'est accompagné', 'est assuré', 'est pris en charge'],
            detailsSpecifiques: [
                'pédagogie adaptée à chaque élève',
                'à domicile ou chez moi',
                'aide aux devoirs, révisions, méthodologie'
            ]
        },
        {
            nom: 'une initiation',
            adjectif: ['à l\'informatique', 'à internet', 'à la bureautique', 'pour débutants'],
            verbe: ['je propose', 'j\'initie', 'je forme', 'nous proposons', 'nous formons'],
            verbeRev: ['est proposée', 'est initiée', 'est formée', 'est assurée', 'est prise en charge'],
            detailsSpecifiques: [
                'pour seniors ou débutants',
                'navigation internet, email, bureautique',
                'patience et clarté garanties'
            ]
        },
        {
            nom: 'des ateliers de langue',
            adjectif: ['français', 'anglais', 'conviviaux', 'pour non-francophones'],
            verbe: ['j\'anime', 'j\'organise', 'je facilite', 'nous animons', 'nous organisons'],
            verbeRev: ['est animé', 'est organisé', 'est facilité', 'est assuré', 'est pris en charge'],
            detailsSpecifiques: [
                'améliorer l\'aisance à l\'oral',
                'petits groupes, thèmes variés',
                'progression adaptée à chacun'
            ]
        }
    ],
    [ServiceCategory.CATEGORY_3]: [
        {
            nom: 'la garde',
            adjectif: ['de chat', 'de chien', 'de petits animaux', 'à domicile'],
            verbe: ['je propose', 'je peux assurer', 'je m\'occupe', 'nous proposons', 'nous assurons'],
            verbeRev: ['est proposée', 'est assurée', 'est prise en charge', 'est réalisée', 'est organisée'],
            detailsSpecifiques: [
                'pendant vos vacances ou week-ends',
                'visites, nourriture, câlins',
                'personne de confiance et amie des animaux'
            ]
        },
        {
            nom: 'la promenade',
            adjectif: ['de chien', 'régulière', 'sécurisée', 'adaptée'],
            verbe: ['je propose', 'je fais', 'je m\'occupe', 'nous proposons', 'nous faisons'],
            verbeRev: ['est proposée', 'est faite', 'est prise en charge', 'est assurée', 'est organisée'],
            detailsSpecifiques: [
                'balades adaptées à ses besoins',
                'dans le quartier ou au parc',
                'régulièrement ou ponctuellement'
            ]
        }
    ],
    [ServiceCategory.CATEGORY_4]: [
        {
            nom: 'la garde',
            adjectif: ['d\'enfants', 'ou le baby-sitting', 'ponctuelle', 'après l\'école'],
            verbe: ['je propose', 'je fais', 'je m\'occupe', 'nous proposons', 'nous faisons'],
            verbeRev: ['est proposée', 'est faite', 'est prise en charge', 'est assurée', 'est organisée'],
            detailsSpecifiques: [
                'en soirée ou le week-end',
                'enfants de tout âge',
                'expérience et références vérifiables'
            ]
        },
        {
            nom: 'de l\'aide',
            adjectif: ['aux devoirs de primaire', 'pour révision du bac', 'en français', 'en maths'],
            verbe: ['je propose', 'j\'accompagne', 'je supervise', 'nous proposons', 'nous accompagnons'],
            verbeRev: ['est proposée', 'est accompagnée', 'est supervisée', 'est assurée', 'est prise en charge'],
            detailsSpecifiques: [
                'méthodologie et encouragement',
                'créneaux après l\'école',
                'aide personnalisée selon le niveau'
            ]
        }
    ],
    [ServiceCategory.CATEGORY_5]: [
        {
            nom: 'de l\'aide',
            adjectif: ['ponctuelle', 'polyvalente', 'pour démarches administratives', 'pour courses'],
            verbe: ['je propose', 'je donne', 'j\'offre', 'nous proposons', 'nous offrons'],
            verbeRev: ['est proposée', 'est donnée', 'est offerte', 'est assurée', 'est prise en charge'],
            detailsSpecifiques: [
                'pour diverses tâches (courses, paperasse simple)',
                'selon mes disponibilités',
                'n\'hésitez pas à demander'
            ]
        },
        {
            nom: 'un partage',
            adjectif: ['de compétences', 'de savoirs', 'convivial', 'réciproque'],
            verbe: ['je propose', 'je partage', 'j\'échange', 'nous proposons', 'nous partageons'],
            verbeRev: ['est proposé', 'est partagé', 'est échangé', 'est assuré', 'est organisé'],
            detailsSpecifiques: [
                'en informatique, cuisine, couture...',
                'échange de savoirs convivial',
                'contactez-moi pour discuter'
            ]
        }
    ],
};

/**
 * POSTS
 * Noms génériques, adjectifs pour la sous-catégorie, verbes et détails adaptés.
 */
const postElementsByCategory: Record<PostCategory, ElementSpecifique[]> = {
    [PostCategory.CATEGORY_1]: [
        {
            nom: 'une clé',
            adjectif: ['perdue', 'trouvée', 'de voiture', 'de maison'],
            verbe: ['j\'ai perdu', 'j\'ai trouvé', 'avis de perte pour', 'nous avons perdu', 'nous avons trouvé', 'on a perdu', 'on a trouvé', 'je signale', 'nous signalons'],
            verbeRev: ['est perdue', 'est trouvée', 'est signalée', 'a été retrouvée', 'a été perdue'],
            detailsSpecifiques: [
                'trousseau avec porte-clé bleu',
                'secteur place de la Mairie',
                'merci de me contacter si retrouvée'
            ]
        },
        {
            nom: 'un téléphone',
            adjectif: ['perdu', 'trouvé', 'portable', 'smartphone'],
            verbe: ['j\'ai perdu', 'j\'ai trouvé', 'avis de perte pour', 'nous avons perdu', 'nous avons trouvé', 'on a perdu', 'on a trouvé', 'je signale', 'nous signalons'],
            verbeRev: ['est perdu', 'est trouvé', 'est signalé', 'a été retrouvé', 'a été perdu'],
            detailsSpecifiques: [
                'marque et modèle à préciser',
                'perdu/trouvé depuis [date] aux alentours de [lieu]',
                'contactez-moi rapidement'
            ]
        },
        {
            nom: 'un chat ',
            adjectif: ['perdu', 'trouvé', 'errant', 'craintif'],
            verbe: ['je recherche', 'j\'ai trouvé', 'avis de recherche pour', 'nous recherchons', 'nous avons trouvé', 'on recherche', 'on a trouvé', 'je signale', 'nous signalons'],
            verbeRev: ['est recherché', 'est trouvé', 'est signalé', 'a été retrouvé', 'a été perdu'],
            detailsSpecifiques: [
                'il est craintif mais gentil',
                'répond au nom de [nom]',
                'merci de partager l\'info'
            ]
        },
        {
            nom: 'un chien ',
            adjectif: ['perdu', 'trouvé', 'gentil', 'noir'],
            verbe: ['je recherche', 'j\'ai trouvé', 'avis de recherche pour', 'nous recherchons', 'nous avons trouvé', 'on recherche', 'on a trouvé', 'je signale', 'nous signalons'],
            verbeRev: ['est recherché', 'est trouvé', 'est signalé', 'a été retrouvé', 'a été perdu'],
            detailsSpecifiques: [
                'il est craintif mais gentil',
                'répond au nom de [nom]',
                'merci de partager l\'info'
            ]
        },
        {
            nom: 'un sac',
            adjectif: ['perdu', 'trouvé', 'à dos', 'de sport'],
            verbe: ['j\'ai perdu', 'j\'ai trouvé', 'avis de perte pour', 'nous avons perdu', 'nous avons trouvé', 'on a perdu', 'on a trouvé', 'je signale', 'nous signalons'],
            verbeRev: ['est perdu', 'est trouvé', 'est signalé', 'a été retrouvé', 'a été perdu'],
            detailsSpecifiques: [
                'couleur et contenu à préciser',
                'retrouvé près de [lieu]',
                'récompense possible'
            ]
        }
    ],
    [PostCategory.CATEGORY_2]: [
        {
            nom: 'un chat',
            adjectif: ['à adopter', 'bébé', 'adulte', 'sociable'],
            verbe: ['je propose à l\'adoption', 'je cherche une famille pour', 'à adopter', 'nous proposons à l\'adoption', 'nous cherchons une famille pour', 'on propose à l\'adoption', 'on cherche une famille pour', 'je donne', 'nous donnons'],
            verbeRev: ['est proposé à l\'adoption', 'est recherché pour adoption', 'est à adopter', 'a été adopté', 'est donné'],
            detailsSpecifiques: [
                'participation demandée pour les frais vétérinaires',
                'mère visible, élevés en famille',
                'adoption sérieuse uniquement'
            ]

        },
        {
            nom: 'des perruches',
            adjectif: ['à adopter', 'couple', 'colorées', 'sociables'],
            verbe: ['je propose à l\'adoption', 'je cherche une famille pour', 'à adopter', 'nous proposons à l\'adoption', 'nous cherchons une famille pour', 'on propose à l\'adoption', 'on cherche une famille pour', 'je donne', 'nous donnons'],
            verbeRev: ['sont proposées à l\'adoption', 'sont recherchées pour adoption', 'sont à adopter', 'ont été adoptées', 'sont données'],
            detailsSpecifiques: [
                'participation demandée pour les frais vétérinaires',
                'mère visible, élevés en famille',
                'adoption sérieuse uniquement'
            ]
        },
        {
            nom: 'des poissons',
            adjectif: ['à échanger', 'colorés', 'aquarium complet'],
            verbe: ['je propose à l\'échange', 'je cherche un échange pour', 'j\'échange', 'nous proposons à l\'échange', 'nous cherchons un échange pour', 'nous échangeons', 'on propose à l\'échange', 'on échange'],
            verbeRev: ['sont proposés à l\'échange', 'sont recherchés pour échange', 'sont à échanger', 'ont été échangés', 'sont échangés'],
            detailsSpecifiques: [
                'aquarium de 100 litres avec filtre et chauffage',
                'idéal pour débutants ou passionnés',
                'échange contre gupille ou autre'
            ]
        },




    ],
    [PostCategory.CATEGORY_3]: [{
        nom: 'un meuble',
        adjectif: ['à vendre', 'en bon état', 'peu servi'],
        verbe: ['je vends', 'je cède', 'à vendre', 'nous vendons', 'nous cédons', 'on vend', 'on cède'],
        verbeRev: ['est vendu', 'est cédé', 'est à vendre', 'a été vendu', 'a été cédé'],
        detailsSpecifiques: [
            'prix à négocier',
            'remise en main propre',
            'photos sur demande'
        ]
    },
    {
        nom: 'un vélo',
        adjectif: ['à vendre', 'adulte', 'enfant', 'bon état'],
        verbe: ['je vends', 'je propose', 'à vendre', 'nous vendons', 'nous proposons', 'on vend', 'on propose'],
        verbeRev: ['est vendu', 'est proposé', 'est à vendre', 'a été vendu', 'a été proposé'],
        detailsSpecifiques: [
            'entretien récent',
            'visible sur rendez-vous',
            'prix à débattre'
        ]
    },
    {
        nom: 'de l\'électroménager',
        adjectif: ['à vendre', 'peu servi', 'fonctionnel'],
        verbe: ['je vends', 'je propose', 'à vendre', 'nous vendons', 'nous proposons', 'on vend', 'on propose'],
        verbeRev: ['est vendu', 'est proposé', 'est à vendre', 'a été vendu', 'a été proposé'],
        detailsSpecifiques: [
            'remise en main propre uniquement',
            'photos sur demande',
            'prix à discuter'
        ]
    },
    {
        nom: 'un ordinateur',
        adjectif: ['à vendre', 'excellent état', 'portable', 'fixe'],
        verbe: ['je vends', 'à vendre', 'je propose', 'nous vendons', 'nous proposons', 'on vend', 'on propose'],
        verbeRev: ['est vendu', 'est à vendre', 'est proposé', 'a été vendu', 'a été proposé'],
        detailsSpecifiques: [
            'peu servi, révisé récemment',
            'remise en main propre',
            'prix à débattre'
        ]
    },
    {
        nom: 'plusieurs livres',
        adjectif: ['à vendre', 'lot', 'différents genres'],
        verbe: ['je vends', 'à vendre', 'je propose', 'nous vendons', 'nous proposons', 'on vend', 'on propose'],
        verbeRev: ['sont vendus', 'sont à vendre', 'sont proposés', 'ont été vendus', 'ont été proposés'],
        detailsSpecifiques: [
            'lot indissociable',
            'prix pour l\'ensemble',
            'à venir chercher sur place'
        ]
    },
    {
        nom: 'des vêtements',
        adjectif: ['à vendre', 'homme', 'femme', 'enfant'],
        verbe: ['je vends', 'à vendre', 'je propose', 'nous vendons', 'nous proposons', 'on vend', 'on propose'],
        verbeRev: ['sont vendus', 'sont à vendre', 'sont proposés', 'ont été vendus', 'ont été proposés'],
        detailsSpecifiques: [
            'différentes tailles disponibles',
            'prix mini',
            'remise en main propre'
        ]
    }
    ],
    [PostCategory.CATEGORY_4]: [
        {
            nom: 'des jouets',
            adjectif: ['à donner', 'gratuit', 'en bon état', 'à récupérer'],
            verbe: ['je donne', 'à récupérer gratuitement', 'j\'offre', 'nous donnons', 'nous offrons', 'on donne', 'on offre'],
            verbeRev: ['sont donnés', 'sont à récupérer', 'sont offerts', 'ont été donnés', 'ont été offerts'],
            detailsSpecifiques: [
                'à venir chercher sur place',
                'idéal pour une seconde vie',
                'contactez-moi pour convenir d\'un rendez-vous'
            ]
        },
        {
            nom: 'des livres',
            adjectif: ['à donner', 'en bon état', 'pour enfants', 'adultes'],
            verbe: ['je donne', 'j\'offre', 'à récupérer', 'nous donnons', 'nous offrons', 'on donne', 'on offre'],
            verbeRev: ['sont donnés', 'sont offerts', 'sont à récupérer', 'ont été donnés', 'ont été offerts'],
            detailsSpecifiques: [
                'plusieurs genres disponibles',
                'à venir chercher sur place',
                'donne en lot ou à l\'unité'
            ]
        },
        {
            nom: 'vêtements',
            adjectif: ['à donner', 'en bon état', 'pour enfants', 'adultes'],
            verbe: ['je donne', 'j\'offre', 'à récupérer', 'nous donnons', 'nous offrons', 'on donne', 'on offre'],
            verbeRev: ['sont donnés', 'sont offerts', 'sont à récupérer', 'ont été donnés', 'ont été offerts'],
            detailsSpecifiques: [
                'vêtements propres et en bon état',
                'plusieurs tailles',
                'contactez-moi pour convenir d\'un rendez-vous'
            ]
        },
        {
            nom: 'de la vaisselle',
            adjectif: ['à donner', 'assiettes', 'verres', 'ustensiles'],
            verbe: ['je donne', 'j\'offre', 'à récupérer', 'nous donnons', 'nous offrons', 'on donne', 'on offre'],
            verbeRev: ['est donnée', 'est offerte', 'est à récupérer', 'a été donnée', 'a été offerte'],
            detailsSpecifiques: [
                'lot complet ou séparé',
                'à venir chercher rapidement',
                'bon état général'
            ]
        }
    ],
    [PostCategory.CATEGORY_5]: [
        {
            nom: 'une information',
            adjectif: ['diverse', 'à vendre', 'à donner', 'utile'],
            verbe: ['je vends', 'je donne', 'je propose', 'nous vendons', 'nous donnons', 'nous proposons', 'on vend', 'on donne'],
            verbeRev: ['est vendue', 'est donnée', 'est proposée', 'a été vendue', 'a été donnée'],
            detailsSpecifiques: [
                'prix sur demande',
                'photos disponibles',
                'remise en main propre'
            ]
        },
        {
            nom: 'service',
            adjectif: ['proposé', 'à échanger', 'solidaire'],
            verbe: ['je propose', 'je cherche', 'je donne un coup de main pour', 'nous proposons', 'nous cherchons', 'nous donnons un coup de main pour', 'on propose', 'on cherche'],
            verbeRev: ['est proposé', 'est recherché', 'est donné', 'a été proposé', 'a été donné'],
            detailsSpecifiques: [
                'aide ponctuelle ou régulière',
                'contactez-moi pour en discuter',
                'disponible en semaine'
            ]
        }
    ],
};

/**
 * SONDAGES
 * Noms génériques, adjectifs pour la sous-catégorie, verbes et détails adaptés.
 */
const surveyElementsByCategory: Record<SurveyCategory, ElementSpecifique[]> = {
    [SurveyCategory.CATEGORY_1]: [
        {
            nom: 'une question',
            adjectif: ['sur la vie quotidienne', 'sur le voisinage', 'sur les espaces communs'],
            verbe: [
                'nous consultons', 'nous demandons votre avis sur', 'nous proposons de vous exprimer concernant',
                'je vous consulte', 'je demande votre avis sur', 'je propose de vous exprimer concernant'
            ],
            verbeRev: [
                'est consultée', 'est demandée', 'est proposée',
                'a été posée', 'a été soumise'
            ],
            detailsSpecifiques: [
                'votre avis est important pour la tranquillité de tous',
                'ensemble, améliorons notre cadre de vie',
                'merci pour votre participation'
            ]
        }
    ],
    [SurveyCategory.CATEGORY_2]: [
        {
            nom: 'le projet',
            adjectif: ['de rénovation', 'd\'amélioration', 'd\'initiative collective'],
            verbe: [
                'nous sondons', 'nous proposons de réfléchir à', 'nous proposons de valider',
                'je sonde', 'je propose de réfléchir à', 'je propose de valider'
            ],
            verbeRev: [
                'est sondé', 'est proposé', 'est validé',
                'a été soumis', 'a été présenté'
            ],
            detailsSpecifiques: [
                'avant de lancer les demandes de devis',
                'impact sur la vie de la résidence',
                'votre implication est la bienvenue'
            ]
        }
    ],
    [SurveyCategory.CATEGORY_3]: [
        {
            nom: 'votre avis',
            adjectif: ['sur la qualité de vie', 'sur les commerces', 'sur la mobilité'],
            verbe: [
                'nous voulons connaître votre ressenti sur', 'nous évaluons', 'nous proposons de faire vos suggestions pour',
                'je veux connaître votre ressenti sur', 'j\'évalue', 'je propose de faire vos suggestions pour'
            ],
            verbeRev: [
                'est évalué', 'est recueilli', 'est proposé',
                'a été collecté', 'a été pris en compte'
            ],
            detailsSpecifiques: [
                'vos suggestions sont les bienvenues',
                'pour agir ensemble',
                'merci de votre retour'
            ]
        }
    ],
    [SurveyCategory.CATEGORY_4]: [
        {
            nom: 'notre organisation',
            adjectif: ['d\'événement', 'de repas', 'd\'atelier'],
            verbe: [
                'nous demandons votre préférence pour', 'nous proposons d\'aider à fixer', 'nous proposons de voter pour',
                'je demande votre préférence pour', 'je propose d\'aider à fixer', 'je propose de voter pour'
            ],
            verbeRev: [
                'est demandée', 'est proposée', 'est votée',
                'a été décidée', 'a été organisée'
            ],
            detailsSpecifiques: [
                'pour renforcer les liens',
                'toutes les propositions seront étudiées',
                'merci de répondre avant la date limite'
            ]
        }
    ],
    [SurveyCategory.CATEGORY_5]: [
        {
            nom: 'une initiative',
            adjectif: ['citoyenne', 'écologique', 'solidaire'],
            verbe: [
                'nous mesurons votre intérêt pour', 'nous proposons de vous impliquer dans', 'nous proposons d\'imaginer',
                'je mesure votre intérêt pour', 'je propose de vous impliquer dans', 'je propose d\'imaginer'
            ],
            verbeRev: [
                'est mesurée', 'est proposée', 'est imaginée',
                'a été lancée', 'a été initiée'
            ],
            detailsSpecifiques: [
                'pour réduire l\'impact environnemental',
                'favoriser l\'entraide',
                'votre avis compte beaucoup'
            ]
        }
    ],
};
/**
 * GROUPES
 */
const groupElementsByCategory: Record<GroupCategory, ElementSpecifique[]> = {
    [GroupCategory.CATEGORY_1]: [
        {
            nom: 'notre collectif',
            adjectif: ['cadre de vie', 'entraide', 'jardinage', 'réparation'],
            verbe: [
                'je rejoins', 'nous rejoignons', 'rejoignez', 'participez à', 'nous participons à', 'je participe à', 'contribuez à', 'nous contribuons à', 'je contribue à'
            ],
            verbeRev: [
                'est rejoint', 'est participé', 'est contribué', 'a été rejoint', 'a été participé'
            ],
            detailsSpecifiques: [
                'proposer des idées, monter des projets concrets',
                'plus de verdure, propreté, lien social',
                'première réunion d\'information'
            ]
        }
    ],
    [GroupCategory.CATEGORY_2]: [
        {
            nom: 'un groupe',
            adjectif: ['syndical', 'espaces verts', 'fêtes', 'vigilance'],
            verbe: [
                'je m\'implique dans', 'nous nous impliquons dans', 'impliquez-vous dans', 'participez à l\'animation de', 'nous animons', 'je construis', 'construisons ensemble', 'nous construisons ensemble'
            ],
            verbeRev: [
                'est impliqué', 'est animé', 'est construit', 'a été impliqué', 'a été animé'
            ],
            detailsSpecifiques: [
                'réunions régulières ouvertes',
                'prise de décision collective',
                'votre implication est la bienvenue'
            ]
        }
    ],
    [GroupCategory.CATEGORY_3]: [
        {
            nom: 'l\'association',
            adjectif: ['citoyenne', 'culturelle', 'mobilité', 'parents d\'élèves'],
            verbe: [
                'je rejoins', 'nous rejoignons', 'rejoignez', 'participez à', 'nous participons à', 'je deviens membre de', 'devenez membre de', 'nous devenons membres de'
            ],
            verbeRev: [
                'est rejointe', 'est participée', 'est devenue membre', 'a été rejointe', 'a été participée'
            ],
            detailsSpecifiques: [
                'porter la voix des habitants',
                'organiser des événements',
                'toutes les bonnes volontés sont recherchées'
            ]
        }
    ],
    [GroupCategory.CATEGORY_4]: [
        {
            nom: 'un club',
            adjectif: ['lecture', 'marche', 'créatif', 'cinéma', 'photo'],
            verbe: [
                'je rejoins', 'nous rejoignons', 'rejoignez', 'participez à', 'nous participons à', 'je partage mes passions à', 'partagez vos passions à', 'nous partageons nos passions à'
            ],
            verbeRev: [
                'est rejoint', 'est participé', 'est partagé', 'a été rejoint', 'a été partagé'
            ],
            detailsSpecifiques: [
                'rencontres régulières',
                'partage, découverte et bonne humeur',
                'tous niveaux bienvenus'
            ]
        }
    ],
    [GroupCategory.CATEGORY_5]: [
        {
            nom: 'notre groupe',
            adjectif: ['écologie', 'jeux', 'cuisine', 'musique'],
            verbe: [
                'je participe à', 'nous participons à', 'participez à', 'j\'échange au sein de', 'nous échangeons au sein de', 'échangez au sein de', 'je découvre', 'nous découvrons', 'découvrez'
            ],
            verbeRev: [
                'est actif', 'est ouvert', 'est découvert', 'a été découvert', 'a été ouvert'
            ],
            detailsSpecifiques: [
                'partage d\'astuces, recettes, jeux',
                'pour un mode de vie plus durable',
                'échanges constructifs et sans jugement'
            ]
        }
    ],
};

/**
 * POOL (CAGNOTTES SOLIDAIRES)
 */
const poolElementsByCategory: ElementSpecifique[] = [
    {
        nom: 'une cagnotte',
        adjectif: ['solidaire', 'urgente', 'pour une famille', 'pour un voisin'],
        verbe: [
            'je lance', 'nous lançons', 'lançons', 'participez à', 'je participe à', 'nous participons à', 'soutenez', 'je soutiens', 'nous soutenons'
        ],
        verbeRev: [
            'est lancée', 'est participée', 'est soutenue', 'a été lancée', 'a été soutenue'
        ],
        detailsSpecifiques: [
            'pour aider une personne en difficulté financière',
            'chaque don, même modeste, compte beaucoup',
            'objectif : réunir la somme nécessaire avant la fin du mois'
        ]
    },
    {
        nom: 'une collecte',
        adjectif: ['de matériel', 'de vêtements', 'de fournitures', 'de denrées'],
        verbe: [
            'j\'organise', 'nous organisons', 'organisons', 'participez à', 'je participe à', 'nous participons à', 'soutenez', 'je soutiens', 'nous soutenons'
        ],
        verbeRev: [
            'est organisée', 'est participée', 'est soutenue', 'a été organisée', 'a été soutenue'
        ],
        detailsSpecifiques: [
            'pour venir en aide à une famille du quartier',
            'dépôt possible à la salle municipale',
            'merci pour votre générosité'
        ]
    },
    {
        nom: 'un vote de points de service',
        adjectif: ['solidaire', 'pour un voisin', 'd\'entraide'],
        verbe: [
            'je propose', 'nous proposons', 'proposons', 'votez pour attribuer', 'je vote pour attribuer', 'nous votons pour attribuer', 'participez à', 'je participe à', 'nous participons à'
        ],
        verbeRev: [
            'est proposé', 'est voté', 'est participé', 'a été proposé', 'a été voté'
        ],
        detailsSpecifiques: [
            'attribuez des points de service à une personne dans le besoin',
            'votre vote compte pour soutenir un membre de la communauté',
            'ensemble, renforçons la solidarité locale'
        ]
    },
    {
        nom: 'un projet collectif',
        adjectif: ['solidaire', 'd\'entraide', 'pour le quartier'],
        verbe: [
            'je lance', 'nous lançons', 'lancez', 'vous participez à', 'je participe à', 'nous participons à', 'vous soutenez', 'je soutiens', 'nous soutenons'
        ],
        verbeRev: [
            'est lancé', 'est participé', 'est soutenu', 'a été lancé', 'a été soutenu'
        ],
        detailsSpecifiques: [
            'objectif : améliorer la vie du quartier grâce à la participation de tous',
            'toutes les idées et contributions sont les bienvenues',
            'votez pour les actions à financer en priorité'
        ]
    },
    {
        nom: 'une initiative',
        adjectif: ['citoyenne', 'locale', 'solidaire'],
        verbe: [
            'je propose', 'nous proposons', 'proposez', 'participez à', 'je participe à', 'nous participons à', 'soutenez', 'je soutiens', 'nous soutenons'
        ],
        verbeRev: [
            'est proposée', 'est participée', 'est soutenue', 'a été proposée', 'a été soutenue'
        ],
        detailsSpecifiques: [
            'pour répondre à un besoin ponctuel ou urgent',
            'toute aide, financière ou matérielle, est précieuse',
            'merci de votre mobilisation'
        ]
    }
];

/**
 * MESSAGES
 * Section unique, pas de sous-catégorie.
 */
const messageElements: ElementSpecifique[] = [
    {
        nom: 'un message',
        adjectif: ['important', 'rapide', 'd\'information', 'de remerciement', 'de bienvenue'],
        verbe: ['j\'envoie', 'je partage', 'je transmets', 'je publie'],
        verbeRev: ['est envoyé', 'est partagé', 'est transmis', 'est publié'],
        detailsSpecifiques: [
            'information utile pour le quartier',
            'merci pour votre implication',
            'n\'hésitez pas à réagir ou commenter'
        ]
    },
    {
        nom: 'mon avis',
        adjectif: ['constructif', 'd\'entraide', 'de soutien', 'de remerciement'],
        verbe: ['je donne', 'je partage', 'j\'exprime'],
        verbeRev: ['est donné', 'est partagé', 'est exprimé'],
        detailsSpecifiques: [
            'pour améliorer notre cadre de vie',
            'merci pour vos retours',
            'ensemble, faisons avancer les choses'
        ]
    }
];

/**
 * ISSUES (litiges liés au service)
 */
const issueElements: ElementSpecifique[] = [
    {
        nom: 'un litige',
        adjectif: ['signalé', 'urgent', 'de service', 'de paiement', 'de qualité'],
        verbe: ['je signale', 'je remonte', 'je décris'],
        verbeRev: ['est signalé', 'est remonté', 'est décrit'],
        detailsSpecifiques: [
            'merci de votre vigilance',
            'une solution sera recherchée rapidement',
            'contactez-moi pour plus de détails'
        ]
    },
    {
        nom: 'un problème',
        adjectif: ['de prestation', 'de communication', 'de délai', 'de conformité'],
        verbe: ['je rencontre', 'je signale', 'je décris'],
        verbeRev: ['est rencontré', 'est signalé', 'est décrit'],
        detailsSpecifiques: [
            'nous faisons le nécessaire pour résoudre ce souci',
            'merci de votre compréhension',
            'un retour vous sera fait rapidement'
        ]
    }
];

/**
 * CONTEXTES
 * Phrases de contexte pour les différentes catégories.
 */
// --- Listes de phrases de complément pour les descriptions ---
const eventContextPhrases = [
    "Cet événement est une excellente occasion de se rencontrer entre voisins.",
    "Nous espérons vous y voir nombreux pour partager un bon moment.",
    "L'ambiance promet d'être [ambiance] et conviviale.",
    "C'est une initiative pour dynamiser la vie de notre quartier à Marseille.",
    "N'oubliez pas de consulter les détails pratiques ci-dessous.",
    "Pensez à inviter vos amis et votre famille !",
    "L'entrée est libre et ouverte à tous.",
    "Une petite participation pourra être demandée pour couvrir les frais."
];

const serviceContextPhrases = [
    "Je suis une personne de confiance et je serai ravi de vous aider.",
    "N'hésitez pas à me contacter pour discuter de vos besoins spécifiques.",
    "Ce service est proposé dans un esprit d'entraide et de bon voisinage à Marseille.",
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
        "Remise en main propre uniquement sur Marseille ou alentours.",
        "Pas d'envoi possible pour cet article.",
        "Idéal pour une seconde vie !"
    ],
    [PostCategory.CATEGORY_3]: [
        "À récupérer rapidement, premier arrivé, premier servi !",
        "Cela fera certainement plaisir à quelqu'un.",
        "Je préfère donner plutôt que jeter.",
        "Pas de réservation, merci de votre compréhension.",
        "Venez le chercher à [lieu] quand vous voulez (sur RDV).",
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
        "À voir sur Marseille.",
        "Curieux s'abstenir, merci.",
        "Possibilité de faire un lot si plusieurs articles vous intéressent."
    ]
};

const surveyContextPhrases = [
    "Votre participation est anonyme et ne prendra que quelques minutes.",
    "Les résultats de ce sondage nous aideront à prendre les bonnes décisions pour notre communauté à Marseille.",
    "Merci de prendre le temps de répondre.",
    "Plus nous aurons de réponses, plus les actions menées seront représentatives.",
    "N'hésitez pas à partager ce sondage avec vos voisins concernés.",
    "La date limite pour répondre est le [date limite fictive].",
    "Ensemble, améliorons notre cadre de vie !"
];

const poolContextPhrases = [
    "Chaque contribution, même modeste, nous sera d'une grande aide.",
    "Merci d'avance pour votre générosité et votre soutien à ce projet important pour Marseille.",
    "N'hésitez pas à partager cette cagnotte autour de vous.",
    "Ensemble, nous pouvons atteindre notre objectif rapidement.",
    "Les fonds récoltés seront utilisés exclusivement pour aider.",
    "Nous vous tiendrons informés de l'avancement du projet.",
    "Un grand merci du fond du cœur pour votre solidarité."
];

const groupContextPhrases = [
    "Rejoignez-nous pour faire une différence dans notre quartier de Marseille !",
    "L'ambiance y est conviviale et les idées de chacun sont les bienvenues.",
    "C'est une belle opportunité de rencontrer d'autres habitants partageant les mêmes intérêts.",
    "Plus nous serons nombreux, plus nos actions auront de l'impact.",
    "N'hésitez pas à nous contacter pour plus d'informations sur nos activités.",
    "La première rencontre/prochaine réunion aura lieu à la gare.",
    "Ensemble, construisons un quartier où il fait bon vivre."
];

const issueContextPhrases = [
    "N'hésitez pas à partager votre avis et vos explications.",
    "Merci de votre soutien et de votre participation.",
]

const messageContextPhrases: string[] = [
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
]


// --- UTILS ---
export function piocherElement<T>(arr: T[]): T {
    if (!arr || arr.length === 0) return ['....'][0] as T
    if (arr.length === 1) return arr[0];
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


function generShortSentence(phrasesSources: string[], elementSpecifique?: ElementSpecifique, options?: ContentOptions, nombreDePhrases = 2): string {
    const phrasesChoisies = new Set<string>();
    let tentatives = 0;
    const maxPhrasesPossibles = phrasesSources?.length + (elementSpecifique?.detailsSpecifiques?.length || 0);
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

    while (phrasesChoisies.size < nombreDePhrases && tentatives < phrasesSources.length * 2 && phrasesSources.length > 0) {
        let phrase = piocherElement(phrasesSources);
        if (options?.ville) phrase = phrase.replace(/\[ville\]/g, options.ville);
        if (options?.date) phrase = phrase.replace(/\[date\]/g, options.date);
        if (options?.auteur) phrase = phrase.replace(/\[auteur\]/g, options.auteur);
        phrase = phrase.replace(/\[ambiance\]/g, piocherElement(['chaleureuse', 'festive', 'conviviale', 'détendue']));
        phrase = phrase.replace(/\[nom\]/g, piocherElement(['Maurice', 'Kiki', 'minou']));
        phrasesChoisies.add(finaliserPhrase(phrase));
        tentatives++;
    }
    return Array.from(phrasesChoisies).join(' ');
}



export async function genereContent(
    sujet: FakerSubjects,
    categoryKey?: string,
    options?: ContentOptions
):
    Promise<{ title: string; description: string, elementRetenu: ElementSpecifique | undefined, image?: string }> {
    let titre: string = '';
    let description: string = '';
    let Element: ElementSpecifique | undefined = { nom: '', adjectif: [], verbe: [], verbeRev: [], detailsSpecifiques: [] };
    let categoryName: string | undefined;
    let pref = Math.random() < 0.75 ? true : false; // 75% de chance d'utiliser le préfixe
    let wordsForTitle: string[] = pref ? titleWords.autre.pref : titleWords.autre.suf
    let image: string | undefined = undefined;
    let needImage = false;
    const nombrePhrasesDescription = Math.floor(Math.random() * 4) + 2
    let rev = Math.random() < 0.7 ? false : true // 30% de chance 
    let securVerb = !rev ? 'je partage' : 'est proposé';
    let ContextPhrases: string[] = groupContextPhrases;
    let catKey: string | undefined


    switch (sujet) {
        case FakerSubjects.EVENT: {
            needImage = true;
            catKey = categoryKey as EventCategory ?? piocherElement(Object.values(EventCategory).filter(k => k !== EventCategory.CATEGORY_5));
            wordsForTitle = pref ? titleWords.event[catKey].pref : titleWords.event[catKey].suf;
            Element = piocherElement(eventElementsByCategory[catKey] ?? eventElementsByCategory[EventCategory.CATEGORY_5]);
            if (!Element) break;
            ContextPhrases = eventContextPhrases;
            break;
        }
        case FakerSubjects.SERVICE: {
            needImage = true
            catKey = categoryKey as ServiceCategory ?? piocherElement(Object.values(ServiceCategory).filter(k => k !== ServiceCategory.CATEGORY_5));
            wordsForTitle = pref ? titleWords.service[catKey].pref : titleWords.service[catKey].suf;
            Element = piocherElement(serviceElementsByCategory[catKey] ?? serviceElementsByCategory[ServiceCategory.CATEGORY_5]);
            if (!Element) break;
            ContextPhrases = serviceContextPhrases;
            securVerb = !rev ? 'je vous propose' : 'vous est proposé'
            break;
        }
        case FakerSubjects.POST: {
            needImage = true;
            catKey = categoryKey as PostCategory ?? piocherElement(Object.values(PostCategory).filter(k => k !== PostCategory.CATEGORY_5))
            wordsForTitle = pref ? titleWords.post[catKey].pref : titleWords.post[catKey].suf
            Element = piocherElement(postElementsByCategory[catKey] ?? postElementsByCategory[PostCategory.CATEGORY_5]);
            if (!Element) break;
            ContextPhrases = postContextPhrases[catKey] ?? postContextPhrases[PostCategory.CATEGORY_5]
            break;
        }
        case FakerSubjects.SURVEY: {
            needImage = true;
            catKey = categoryKey as SurveyCategory ?? piocherElement(Object.values(SurveyCategory).filter(k => k !== SurveyCategory.CATEGORY_5));
            wordsForTitle = pref ? titleWords.survey[catKey].pref : titleWords.survey[catKey].suf
            Element = piocherElement(surveyElementsByCategory[catKey] ?? surveyElementsByCategory[SurveyCategory.CATEGORY_5]);
            if (!Element) break;
            ContextPhrases = surveyContextPhrases;
            break;
        }
        case FakerSubjects.GROUP: {
            needImage = false
            categoryKey as GroupCategory ?? piocherElement(Object.values(GroupCategory).filter(k => k !== GroupCategory.CATEGORY_5))
            wordsForTitle = pref ? titleWords.group.pref : titleWords.group.suf
            Element = piocherElement(groupElementsByCategory[catKey] ?? groupElementsByCategory[GroupCategory.CATEGORY_5]);
            if (!Element) break;
            ContextPhrases = groupContextPhrases;
            securVerb = !rev ? 'Nous vous invitons à' : 'vous attends';
            break;
        }
        case FakerSubjects.POOL: {
            needImage = false;
            Element = piocherElement(poolElementsByCategory);
            wordsForTitle = pref ? titleWords.pool.pref : titleWords.pool.suf;
            if (!Element) break;
            ContextPhrases = poolContextPhrases;
            securVerb = !rev ? 'je vous invite à participer à' : 'attends votre participation ';
            break;
        }
        case FakerSubjects.MESSAGE: {
            needImage = false;
            Element = piocherElement(messageElements);
            wordsForTitle = pref ? titleWords.message.pref : titleWords.message.suf;
            if (!Element) break;
            ContextPhrases = messageContextPhrases;
            securVerb = !rev ? 'je vous ecrire' : '';
        }
        case FakerSubjects.ISSUE: {
            needImage = false;
            Element = piocherElement(issueElements);
            if (!Element) break;
            ContextPhrases = issueContextPhrases;
            securVerb = !rev ? 'je vous soumette' : 'soumette';
            break;
        }
        case FakerSubjects.AUTRE:
        default: {
            pref = false
            needImage = false;
            const randomSujetAutre = piocherElement(Object.values(titleWords.autre).flat());
            Element = {
                nom: `un sujet (${randomSujetAutre.toLowerCase()})`,
                verbe: ["aimerions partager une information sur", "voudrions partager à propos de"]
            };
            break;
        }
    }

    //// CONSTRUCTION FINAL
    let verb = !rev ? piocherElement(Element.verbe ?? []) : piocherElement(Element.verbeRev ?? []);
    !verb && (verb = securVerb);
    let baseTitre = piocherElement(wordsForTitle);
    let add = piocherElement(Element.adjectif) || '';
    let nom = Element.nom + ' ' + add;
    titre = pref ? `${baseTitre} ${nom}` : `${nom} ${baseTitre}`;
    const descIntro = rev ? finaliserPhrase(`${nom} ${verb}`) : finaliserPhrase(`${verb} ${nom}`);
    description = descIntro + ' ' + generShortSentence(ContextPhrases, Element, options, nombrePhrasesDescription - 1);

    if (needImage) {
        const keyWord = (nom.toLowerCase().split(' ')).filter(word => {
            word.replace("'", ' '); //
            if (word.length < 3) return false;
            if (wordToExclude.includes(word)) return false;
            if (linkWords.includes(word)) return false
            return true
        })
        let keySentence = keyWord.length > 0 ? keyWord.join(' ') : ''
        const keyWords: string[] = keySentence.split(' ')
        catKey ? keyWords.push(catKey) : keyWords.push('Marseille')
        image = await getRandomPixabayImageUrl(keyWords)
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
        FakerSubjects.EVENT,
        // FakerSubjects.SERVICE, FakerSubjects.POST,
        // FakerSubjects.SURVEY, FakerSubjects.GROUP, FakerSubjects.POOL,
        // FakerSubjects.MESSAGE, FakerSubjects.AUTRE
    ];

    const quelquesCategoriesParSujet = {
        [FakerSubjects.EVENT]: [EventCategory.CATEGORY_1, EventCategory.CATEGORY_2,],
        [FakerSubjects.SERVICE]: [ServiceCategory.CATEGORY_1, ServiceCategory.CATEGORY_4],
        [FakerSubjects.POST]: [PostCategory.CATEGORY_3, PostCategory.CATEGORY_1],
        [FakerSubjects.SURVEY]: [SurveyCategory.CATEGORY_2, SurveyCategory.CATEGORY_4],
        [FakerSubjects.GROUP]: [GroupCategory.CATEGORY_1, GroupCategory.CATEGORY_4],
        [FakerSubjects.POOL]: [undefined], // Pas de sous-catégories
        [FakerSubjects.MESSAGE]: [undefined],
    };

    sujetsATester.forEach(sujet => {
        const categoriesPourCeSujet = quelquesCategoriesParSujet[sujet];
        if (categoriesPourCeSujet && Array.isArray(categoriesPourCeSujet)) {
            categoriesPourCeSujet.forEach(async (catKey: string | undefined) => {
                const resultat = await genereContent(sujet, catKey);
                let infoCat = catKey ? ` (Catégorie testée: ${catKey})` : '  ';
                console.log(`\n## ${capitaliser(sujet)}${infoCat ?? ''} ##`);
                console.log('Élément retenu:', resultat.elementRetenu?.nom);
                console.log('Titre:', resultat.title);
                console.log('Description:', resultat.description);
                console.log('Image:', resultat.image);
            });
        }
        console.log('-------------------------------');
    });

}

testGenerateur();
