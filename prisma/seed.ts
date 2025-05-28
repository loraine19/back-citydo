import { $Enums, PrismaClient, Service } from '@prisma/client';
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
import { Decimal } from '@prisma/client/runtime/library';
import { CreateFlagDto } from 'src/flags/dto/create-flag.dto';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
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
import { CreatePoolDto } from 'src/pools-surveys/dto/create-pool.dto';
import { CreateSurveyDto } from 'src/pools-surveys/dto/create-survey.dto';

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
const usersService = new UsersService(prismaService)
const eventService = new EventsService(prismaService, notificationsService, addressService)
const participantsService = new ParticipantsService(prismaService, notificationsService, usersService)
const servicesService = new ServicesService(prismaService, notificationsService)
const issuesService = new IssuesService(prismaService, notificationsService)
const postsService = new PostsService(prismaService, notificationsService)
const likesService = new LikesService(prismaService, notificationsService)
const votesService = new VotesService(prismaService, notificationsService, usersService)
const flagsService = new FlagsService(prismaService, notificationsService)
const messagesService = new MessagesService(prismaService, notificationsService)
const now = new Date();


/// GENERE IMAGE FROM SEED 
export const getImageBlob = async (url: string): Promise<Uint8Array<ArrayBufferLike>> => {
  let response = await fetch(url);
  let blob = await response.blob();
  let buffer = Buffer.from(await blob.arrayBuffer());
  // return "data:" + blob.type + ';base64,' + buffer.toString('base64');
  return buffer;
}

enum FakerSubjects {
  EVENT = 'event',
  SERVICE = 'service',
  POST = 'post',
  POOL = 'pool',
  SURVEY = 'survey',
  GROUP = 'group',
  MESSAGE = 'message',
  AUTRE = 'autre',
}

enum GroupCategory {
  CATEGORY_1 = 'Quartier',
  CATEGORY_2 = 'Copropriété',
  CATEGORY_3 = 'Arrondissement',
  CATEGORY_4 = 'Par activité',
  CATEGORY_5 = 'Autre',
}
enum EventCategory {
  CATEGORY_1 = 'Sport',
  CATEGORY_2 = 'Social',
  CATEGORY_3 = 'Culturel',
  CATEGORY_4 = 'Musique',
  CATEGORY_5 = 'Autre',
}
enum ServiceCategory {
  CATEGORY_1 = 'Bricolage et entretien',
  CATEGORY_2 = 'Cours et formation',
  CATEGORY_3 = 'Animaux',
  CATEGORY_4 = 'Enfants',
  CATEGORY_5 = 'Autre',
}
enum PostCategory {
  CATEGORY_1 = "Perdu-Trouvé",
  CATEGORY_2 = "Animaux",
  CATEGORY_3 = "À vendre",
  CATEGORY_4 = "Je donne",
  CATEGORY_5 = "Autre",
}
enum SurveyCategory {
  CATEGORY_1 = 'Règles de quartier',
  CATEGORY_2 = 'Projet de travaux',
  CATEGORY_3 = 'Partage d\'opinion',
  CATEGORY_4 = 'Organisation d\'événement',
  CATEGORY_5 = 'Autre projet',
}

const titleWordsByKey = {
  event: ['Événement à ne pas manquer', 'Grand rendez-vous', 'Nouvel atelier participatif', 'Fête de quartier immanquable', 'Réunion d\'information ', 'Sortie conviviale', 'Invitation ', 'Festival local en préparation', 'Rassemblement citoyen', 'Célébration de la communauté', 'Activité sportive à venir', 'Concert en plein air', 'Spectacle à découvrir', 'Atelier créatif', 'Conférence passionnante', 'Projection cinéma en plein air'],
  service: ['Service d\'entraide', 'Proposition de service utile', 'Besoin d\'un coup de main ?', 'Recherche de service spécifique', 'Aide et partage de compétences', 'Service de proximité ', 'Entraide entre voisins', 'Bon plan service à découvrir'],
  post: ['Annonce', 'Information pour le quartier', 'Objet à donner ou à vendre', 'Objet perdu / trouvé', 'Partage d\'information utile', 'Bon plan : annonce à consulter', 'Avis à la communauté', 'Objet à récupérer', 'Annonce de voisinage', 'Partage d\'objet ou service', 'Objet à vendre ou échanger', 'Infos utiles', 'Objet à donner', 'à donner', 'Pour debarasser', 'J\'perdu', 'J\'ai trouvé'],
  pool: ['Nouvelle cagnotte solidaire', 'Soutien participatif pour projet', 'Appel urgent aux dons', 'Projet commun à financer', 'Collecte pour une bonne cause', 'Ensemble pour réaliser ce rêve'],
  survey: ['Votre avis est essentiel', 'Grand sondage citoyen', 'Consultation locale en cours', 'Participez au vote important', 'Question à la communauté', 'Exprimez-vous librement sur'],
  group: ['Collectif', 'Communauté', 'Nouveau groupe', 'Association locale', 'Équipe dynamique', 'Réseau de solidarité', 'Club', 'Cercle d\'amis', 'Groupe de passionnés', 'Copropriété', 'Quartier solidaire'],
  autre: ['Information diverse et variée', 'Message important à lire', 'Communication pour le quartier', 'Sujet d\'intérêt général'],
};

const linkWords = ['et', 'ou', 'mais', 'donc', 'ni', 'car', 'aussi', 'alors', 'ainsi', 'cependant', 'pourtant', 'toutefois', 'néanmoins', 'en effet', 'quand', 'lorsque', 'comme', 'si', 'puisque', 'parce que', 'afin de', 'pour que', 'afin que', 'bien que', 'pendant que', 'à', 'de', 'en', 'pour', 'par', 'sur', 'sous', 'avec', 'sans', 'chez', 'vers', 'dans', 'concernant', 'autour de', 'malgré', 'par exemple', 'c\'est-à-dire', 'notamment', 'surtout', 'également', 'non seulement', 'mais aussi', 'au sein de'];

// --- LISTES DE MOTS CATÉGORISÉES ---
// (Ces listes doivent être très fournies pour une bonne variété)

const eventTypesByCategory = {
  [EventCategory.CATEGORY_1]: ["match de foot", "tournoi de pétanque", "marathon, course du quartier", "séance de yoga", "olympiades locales", "randonnée VTT", "initiation escalade", "concours de pêche", "evenement sortie piscine", "cours de zumba"],
  [EventCategory.CATEGORY_2]: ["fête des voisins", "café rencontre", "apéro partagé", "soirée jeux", "pique-nique géant", "barbecue collectif", "accueil nouveaux arrivants", "repas solidaire", "après-midi familles", "veillée contes"],
  [EventCategory.CATEGORY_3]: ["visite de musée", "exposition de peinture", "cinéma en plein air", "conférence histoire locale", "atelier d'écriture", "club de lecture", "théâtre amateur", "spectacle de danse", "démonstration artisanat", "concours photo"],
  [EventCategory.CATEGORY_4]: ["concert acoustique", "scène ouverte musicale", "répétition chorale", "festival musique locale", "blind test musical", "atelier djembé", "fanfare de rue", "karaoké", "jam session", "cours de chant"],
  [EventCategory.CATEGORY_5]: ["opération 'Quartier Propre'", "atelier jardinage collectif", "brocante solidaire", "réunion publique d'information", "repair café", "collecte de jouets", "atelier compostage", "distribution paniers légumes", "débat citoyen écologie", "bourse aux vélos"],
};
const eventObjectifs = ["renforcer les liens", "partager un moment convivial", "découvrir de nouvelles passions", "soutenir une cause locale", "améliorer notre cadre de vie", "faire connaissance", "s'amuser ensemble", "promouvoir la culture", "encourager le sport", "échanger des idées"];
const eventAmbiances = ["festive", "détendue", "chaleureuse", "sportive", "culturelle", "créative", "solidaire", "musicale", "studieuse", "familiale"];
const eventPublics = ["ouvert à tous", "pour les familles", "pour les jeunes", "pour les aînés", "pour les sportifs", "amateurs de musique", "artistes en herbe", "amoureux de la nature", "membres du groupe", "curieux"];
const eventDetailsPratiques = ["au centre social dès 14h", "parc municipal samedi prochain", "place du village à 18h", "inscription par email", "entrée libre", "chacun apporte un plat", "tenue de sport conseillée", "instruments bienvenus", "infos sur le site", "contactez-moi"];

const serviceTypesByCategory = {
  [ServiceCategory.CATEGORY_1]: ["petit bricolage", "montage de meubles", "réparation vélo", "entretien jardin", "aide déménagement", "nettoyage", "réparation électroménager", "conseils déco", "petits travaux peinture", "débarras cave", "réparation informatique", "installation étagères", "aide courses", "réparation plomberie",],
  [ServiceCategory.CATEGORY_2]: ["soutien scolaire maths", "cours de français", "initiation informatique", "cours de guitare", "aide rédaction CV", "conversation anglais", "cours de cuisine", "formation premiers secours", "aide usage tablette", "conseils potager bio", "cours de yoga", "initiation photographie",],
  [ServiceCategory.CATEGORY_3]: ["garde de chat à domicile", "promenade de chien", "visite animaux", "pet-sitting rongeurs", "conseils éducation canine", "transport vétérinaire", "recherche animal perdu", "fabrication jouets animaux", "toilettage basique", "info adoption", "conseils alimentation animale",],
  [ServiceCategory.CATEGORY_4]: ["baby-sitting soirée", "aide aux devoirs primaire", "accompagnement école", "animation anniversaire enfant", "garde d'enfants urgence", "lecture d'histoires", "loisir créatif enfants", "surveillance sieste", "aide repas enfants", "accompagnement parc"],
  [ServiceCategory.CATEGORY_5]: ["covoiturage courses", "aide démarches administratives", "accompagnement RDV médicaux", "prêt d'outils", "correction documents", "aide organisation événement familial", "partage recettes", "petits dépannages divers", "conseils réduction énergie", "traduction simple"],
};
const serviceActions = ["propose", "offre mon aide pour", "recherche une personne pour", "demande un service de", "partage mes compétences en", "peux aider avec", "cherche coup de main pour", "suis disponible pour", "offre mes services pour", "ai besoin d'assistance pour"];
const serviceDetails = ["disponible le week-end", "en soirée", "intervention rapide", "matériel fourni", "gratuit ou échange", "tarif solidaire", "expérience confirmée", "personne de confiance", "à domicile", "flexible"];
const serviceAppels = ["contactez-moi", "n'hésitez pas", "plus d'infos par message", "à votre service", "discutons-en", "premier contact par email", "je suis à l'écoute", "merci", "partagez l'info", "réponse rapide"];

const postObjetsByCategory = {
  [PostCategory.CATEGORY_1]: ["clés de voiture", "portefeuille perdu", "téléphone égaré", "lunettes de vue", "doudou d'enfant", "chat perdu", "chien trouvé", "parapluie oublié", "sac à dos", "carte de transport"],
  [PostCategory.CATEGORY_2]: ["chatons à adopter", "chien cherche famille", "accessoires pour animaux", "cage de transport", "conseils animaliers", "recherche saillie", "appel à témoins animal", "promenade chiens", "famille d'accueil animal", "graines pour oiseaux"],
  [PostCategory.CATEGORY_3]: ["vélo de ville", "meuble ancien", "vêtements de marque", "livres de collection", "électroménager récent", "voiture d'occasion", "outils professionnels", "console de jeux", "instrument de musique", "articles puériculture"],
  [PostCategory.CATEGORY_4]: ["vêtements bébé", "jouets d'enfants", "livres variés", "vaisselle diverse", "plantes d'intérieur", "petits meubles", "restes matériel bricolage", "conserves alimentaires", "fournitures scolaires", "ordinateur fonctionnel"],
  [PostCategory.CATEGORY_5]: ["information circulation", "appel à vigilance", "organisation fête voisins", "question à la communauté", "partage d'expérience", "coup de gueule propreté", "idée pour convivialité", "recherche partenaires projet", "offre de stage/emploi", "remerciement collectif"],
};
const postEtatObjet = ["neuf", "comme neuf", "très bon état", "bon état", "fonctionnel", "usagé mais utilisable", "propre", "bien entretenu", "traces d'usure", "complet", "prêt à l'emploi", "à récupérer vite", "état correct", "seconde vie", "à réparer"];
const postActions = ["donne", "vends", "échange", "prête", "cherche", "souhaite donner", "propose", "offre", "partage", "mets à disposition", "recherche", "souhaite échanger", "mets en vente", "cède", "transmets"];
const postRaisons = ["changement de situation", "manque de place", "plus besoin", "grand tri", "nouvel achat", "pour aider", "esprit de partage", "éviter gaspillage", "soutenir communauté", "rendre service", "seconde vie", "démarche solidaire", "désencombrer", "faire plaisir"];
const postConditions = ["disponible rapidement", "à venir chercher", "envoi possible", "prix négociable", "gratuit", "sans contrepartie", "premier arrivé", "contact par message", "joignable facilement", "visible sur RDV", "récupérer ce week-end", "remise en main propre", "à convenir", "à discuter"];
const postAppelAction = ["contactez-moi", "n'hésitez pas", "faites-moi signe", "réponds à vos questions", "photos sur demande", "au plaisir d'échanger", "profitez-en", "merci pour l'intérêt", "partagez l'info", "reste disponible", "merci pour vos retours", "à bientôt"];

const surveySubjectsByCategory = {
  [SurveyCategory.CATEGORY_1]: ["les règles de stationnement", "la gestion du bruit", "l'entretien des espaces communs", "le règlement de copropriété", "l'utilisation de la laverie"],
  [SurveyCategory.CATEGORY_2]: ["la rénovation de la façade", "l'aménagement d'un espace vert", "l'installation d'équipements collectifs", "la réfection de la voirie", "le choix des entreprises pour travaux"],
  [SurveyCategory.CATEGORY_3]: ["vos idées pour le quartier", "vos préférences d'activités", "votre opinion sur la gestion", "les sujets pour prochaines réunions", "vos attentes en communication"],
  [SurveyCategory.CATEGORY_4]: ["le choix de date pour un événement", "le type d'activité pour la fête", "la sélection des animations", "le budget pour une sortie", "les thèmes d'ateliers"],
  [SurveyCategory.CATEGORY_5]: ["une bibliothèque partagée", "des achats groupés", "le gardiennage de plantes", "un journal de quartier", "une initiative zéro déchet"],
};
const surveyObjectifs = ["mieux répondre à vos attentes", "décider ensemble", "faire avancer le projet", "recueillir vos opinions", "orienter nos actions"];
const surveyActions = ["donnez votre avis", "votez", "participez", "exprimez-vous", "répondez au sondage", "partagez vos idées"];
const surveyAppels = ["merci pour votre participation", "votre avis compte", "ensemble, décidons", "à vous de jouer", "résultats bientôt partagés"];

const poolSubjects = ["financement local associatif", "aide famille en difficulté", "achat matériel atelier créatif", "soutien voisin dans le besoin", "création jardin partagé", "sauvetage animaux errants", "achat jeux pour enfants", "rénovation espace commun", "sortie pour seniors", "fresque murale participative"];
const poolObjectifs = ["aider concrètement", "financer l'achat de matériel", "soutenir moralement et financièrement", "réaliser un rêve collectif", "apporter de la joie"];
const poolActions = ["participez généreusement", "contribuez à la réussite", "soutenez l'initiative", "faites un don", "rejoignez la cagnotte"];
const poolAppels = ["merci pour votre générosité", "ensemble on va plus loin", "chaque don compte", "partagez autour de vous", "votre soutien est essentiel"];

const groupTypesByCategory = {
  [GroupCategory.CATEGORY_1]: ["collectif citoyen quartier", "groupe d'entraide local", "comité d'amélioration urbaine", "association des résidents", "voisins vigilants et solidaires"],
  [GroupCategory.CATEGORY_2]: ["conseil syndical copropriété", "groupe copropriétaires pour travaux", "association résidents immeuble", "collectif entretien espaces verts", "groupe discussion locataires/propriétaires"],
  [GroupCategory.CATEGORY_3]: ["collectif citoyen arrondissement", "groupe projet arrondissement", "association culturelle arrondissement", "comité des fêtes arrondissement", "réseau entraide inter-quartiers"],
  [GroupCategory.CATEGORY_4]: ["club de course à pied", "groupe de lecture", "jardiniers amateurs", "équipe foot loisir", "atelier tricot", "cercle jeux de société", "groupe randonneurs", "passionnés photo", "musiciens pour jams", "amateurs cuisine"],
  [GroupCategory.CATEGORY_5]: ["groupe soutien jeunes parents", "collectif actions environnementales", "réseau covoiturage", "groupe défense droits locataires", "amicale anciens élèves école"],
};
const groupObjectifs = ["l'entraide quotidienne", "le partage de services", "la réalisation de projets communs", "la promotion de la solidarité", "l'organisation d'actions locales", "la création d'une dynamique de quartier", "le renforcement du lien social"];
const groupActions = ["rejoignez-nous", "participez activement", "imaginez avec nous", "construisons ensemble", "proposez vos idées", "devenez membre"];
const groupAppels = ["ensemble, c'est mieux", "contactez-nous pour infos", "au plaisir de vous accueillir", "bienvenue à tous", "votre participation est précieuse"];

const motsTexteMessage = {
  intro: ['Bonjour', 'Salut', 'Coucou', 'Bonsoir', 'Hello', 'Cher voisin / Chère voisine,', 'Excusez-moi de vous déranger,'],
  corps: [
    'J\'espère que vous allez bien.', 'Je vous écris pour vous informer que', 'Je voulais vous demander si', 'Je tenais à vous signaler que',
    'Comment allez-vous ?', 'J\'aurais une question concernant votre annonce.', 'Merci pour votre proposition de service !',
    'L\'événement de samedi est-il toujours maintenu ?', 'Je voudrais participer à la cagnotte, comment faire ?',
    'Des nouvelles du projet de jardin partagé ?', 'Pouvons-nous discuter de la dernière réunion ?',
    'Nouveau/nouvelle dans le quartier, j\'aimerais m\'impliquer.', 'Merci pour l\'invitation à l\'atelier, je serai là !',
    'Passez une excellente journée !', 'Je vous contacte suite à votre message.', 'J\'ai vu votre annonce et suis intéressé(e).'
  ],
  conclusion: ['Bonne journée !', 'Merci d\'avance.', 'À très bientôt.', 'Cordialement.', 'Bien à vous.', 'Au plaisir.', 'Salutations.', 'Merci pour votre temps.']
};


//// FONCTIONS UTILITAIRES
function piocherElement<T>(tableau: T[], defaultValue: T | null = null): T {
  if (!tableau || tableau.length === 0) {
    if (defaultValue !== null) return defaultValue;
    return '' as unknown as T;
  }
  return tableau[Math.floor(Math.random() * tableau.length)];
}

function piocherElementParCategorie<T extends string>(
  objetDeListesParCategorie: Record<string, T[]>,
  keyCategorie?: string,
  listeFallback?: T[]
): T {
  const fallbackValue = piocherElement(listeFallback || Object.values(objetDeListesParCategorie).flat(), '' as T);

  if (keyCategorie && objetDeListesParCategorie[keyCategorie] && objetDeListesParCategorie[keyCategorie].length > 0) {
    return piocherElement(objetDeListesParCategorie[keyCategorie], fallbackValue);
  }
  return fallbackValue;
}

function capitaliserPremiereLettre(chaine: string): string {
  if (!chaine) return '';
  return chaine.charAt(0).toUpperCase() + chaine.slice(1);
}

function finaliserPhrase(phrase: string): string {
  if (!phrase) return '';
  phrase = phrase.trim().replace(/\s+/g, ' ').replace(/\s+([?.!,:;])/g, '$1').replace(/([?.!,:;])\1+/g, '$1');
  if (phrase && !/[.!?]$/.test(phrase)) phrase += '.';
  return capitaliserPremiereLettre(phrase);
}

function genererPhraseSpecifique(gabarits: string[], remplacements: Record<string, () => string>): string {
  const gabaritChoisi = piocherElement(gabarits, "Information importante.");
  if (!gabaritChoisi) return "Contenu par défaut.";
  let phraseGeneree = gabaritChoisi;
  for (const placeholder in remplacements) {
    phraseGeneree = phraseGeneree.replace(new RegExp(`{{${placeholder}}}`, 'g'), remplacements[placeholder]());
  }
  return finaliserPhrase(phraseGeneree);
}

//// GÉNÉRATION DE PHRASES SPÉCIFIQUES (AVEC AU MOINS 10 GABARITS PAR TYPE)

// --- ÉVÉNEMENTS ---
function genererPhraseEvenement(categoryKey?: keyof typeof EventCategory): string {
  const typeEvent = piocherElementParCategorie(eventTypesByCategory, categoryKey, eventTypesByCategory[EventCategory.CATEGORY_5]);
  const objectif = piocherElement(eventObjectifs);
  const ambiance = piocherElement(eventAmbiances);
  const publicCible = piocherElement(eventPublics);
  const details = piocherElement(eventDetailsPratiques);
  const gabarits = [
    `Ne manquez pas notre prochain ${typeEvent} ! Ce sera ${ambiance}, parfait pour ${objectif}. ${details}.`,
    `Invitation spéciale à tous les ${publicCible} pour un ${typeEvent}. Venez ${objectif} dans une ambiance ${ambiance}. Lieu et heure : ${details}.`,
    `Rejoignez-nous pour un ${typeEvent} ! Un excellent moyen de ${objectif}. Prévu pour ${publicCible}. Ambiance ${ambiance} assurée. Infos : ${details}.`,
    `Le collectif organise un ${typeEvent} dédié à ${objectif}. ${details}. Nous espérons une ambiance ${ambiance} et la présence de ${publicCible}.`,
    `C'est avec joie que nous vous convions à un ${typeEvent}. L'idée est de ${objectif}. ${details}. Ce sera ${ambiance} et les ${publicCible} sont les bienvenus.`,
    `Un événement à noter : ${typeEvent} ! Pour ${objectif} et passer un moment ${ambiance}. Ouvert à ${publicCible}. Détails : ${details}.`,
    `Quoi de prévu ? Venez à notre ${typeEvent} ! ${objectif}. Ambiance ${ambiance}. ${details}. Parfait pour ${publicCible}.`,
    `Grande nouvelle ! Nous lançons un ${typeEvent} afin de ${objectif}. ${details}. Ambiance ${ambiance}, pour le plaisir de ${publicCible}.`,
    `Venez nombreux à notre ${typeEvent} ! Une occasion unique de ${objectif}. ${details}. Cadre ${ambiance}, pour ${publicCible}.`,
    `Participez et partagez : un ${typeEvent} est organisé pour ${objectif}. ${details}. Ambiance ${ambiance} garantie. Attendu pour ${publicCible}.`,
    `Rendez-vous pour un ${typeEvent}, une belle opportunité de ${objectif}. Ambiance ${ambiance}, ${publicCible} conviés. Infos : ${details}.`
  ];
  return finaliserPhrase(piocherElement(gabarits));
}

// --- SERVICES ---
function genererPhraseService(categoryKey?: keyof typeof ServiceCategory): string {
  const typeServ = piocherElementParCategorie(serviceTypesByCategory, categoryKey, serviceTypesByCategory[ServiceCategory.CATEGORY_5]);
  const action = piocherElement(serviceActions);
  const detail = piocherElement(serviceDetails);
  const appel = piocherElement(serviceAppels);
  const gabarits = [
    `Bonjour, je ${action} ${typeServ}. Disponible ${detail}. N'hésitez pas à ${appel}.`,
    `Proposition de service : ${typeServ}. Je suis ${action} et peux intervenir ${detail}. Pour me joindre, ${appel}.`,
    `Besoin d'un coup de main pour ${typeServ} ? J' ${action} avec plaisir. ${detail}. Faites-moi signe, ${appel}.`,
    `Je mets mes compétences à disposition pour ${typeServ}. J' ${action} ce service ${detail}. Si intéressé(e), ${appel}.`,
    `Avis aux voisins : j' ${action} ${typeServ}. Conditions : ${detail}. Au plaisir de vous ${appel}.`,
    `Recherche ou proposition ${typeServ}. J' ${action} ce service ${detail}. On peut ${appel} pour en discuter.`,
    `Entraide de quartier, j' ${action} mon aide pour ${typeServ}. ${detail}. Pour toute demande, ${appel}.`,
    `Si vous avez besoin de ${typeServ}, sachez que j' ${action}. Modalités : ${detail}. Je suis à votre disposition, ${appel}.`,
    `Pour vous rendre service, j' ${action} ${typeServ}. Je suis disponible ${detail}. Alors, n'hésitez pas, ${appel} !`,
    `Partage de compétences, j' ${action} ${typeServ}. ${detail}. Intéressé(e) ? Vous pouvez ${appel}.`,
    `Un service de ${typeServ} vous est proposé. J' ${action} avec des disponibilités ${detail}. N'hésitez pas à ${appel}.`
  ];
  return finaliserPhrase(piocherElement(gabarits));
}

// --- ANNONCES (POST) ---
function genererPhraseAnnonce(categoryKey?: keyof typeof PostCategory): string {
  const objet = piocherElementParCategorie(postObjetsByCategory, categoryKey, postObjetsByCategory[PostCategory.CATEGORY_5]);
  const action = piocherElement(postActions);
  const etat = piocherElement(postEtatObjet);
  const raison = piocherElement(postRaisons);
  const condition = piocherElement(postConditions);
  const appel = piocherElement(postAppelAction);
  const gabarits = [
    `Je ${action} ${objet} en ${etat}. Idéal si ${raison}. ${condition}. N'hésitez pas à ${appel} !`,
    `Bonjour à tous, je ${action} un(e) ${objet} qui est en ${etat}. C'est parfait si ${raison}. Visible ${condition}. ${appel} pour plus d'infos.`,
    `Offre spéciale : ${objet} (${etat}) à ${action}. La raison : ${raison}. ${appel} si intéressé(e).`,
    `${capitaliserPremiereLettre(action)} : Un(e) magnifique ${objet}, ${etat}. Idéal pour ${raison}. Conditions : ${condition}.`,
    `Message : je ${action} ${objet}. Il est ${etat} car ${raison}. ${appel}.`,
    `À saisir : ${objet} en ${etat}, disponible car je ${action}. Utile si ${raison}. ${condition}. Alors, ${appel}.`,
    `Je propose : ${objet} (${etat}) parce que je ${action}. ${raison}. Contactez-moi vite, ${condition}.`,
    `Annonce du jour : ${objet} à ${action}. État : ${etat}. Motif : ${raison}. ${condition}. Pensez à ${appel}.`,
    `Envie de ${action} un(e) ${objet} ? Il/elle est ${etat} et correspondra si ${raison}. ${appel}.`,
    `Je mets à disposition  ${objet} en ${etat}, car je ${action}. ${raison}. ${condition}. Vous pouvez ${appel}.`
  ];
  return finaliserPhrase(piocherElement(gabarits));
}

// --- SONDAGES (SURVEY) ---
function genererPhraseSondage(categoryKey?: keyof typeof SurveyCategory): string {
  const sujet = piocherElementParCategorie(surveySubjectsByCategory, categoryKey, surveySubjectsByCategory[SurveyCategory.CATEGORY_5]);
  const objectif = piocherElement(surveyObjectifs);
  const action = piocherElement(surveyActions);
  const appel = piocherElement(surveyAppels);
  const gabarits = [
    `Votre avis est crucial ! Participez à notre sondage concernant ${sujet}. L'objectif est de ${objectif}. Merci de ${action} dès que possible. ${appel} !`,
    `Nouveau sondage en ligne pour discuter de ${sujet}. Nous aimerions ${objectif} avec votre aide. Pour cela, merci de ${action}. ${appel}.`,
    `Consultation : que pensez-vous de ${sujet} ? Votre opinion nous aidera à ${objectif}. ${action} via le lien. ${appel}.`,
    `Exprimez-vous sur ${sujet} ! Ce sondage vise à ${objectif}. ${action} avant la date limite. ${appel}.`,
    `Nous lançons une consultation sur ${sujet} pour ${objectif}. Votre ${action} est importante. ${appel}.`,
    `Participez à notre enquête sur ${sujet}. Le but est de ${objectif}. Merci de ${action}. ${appel}.`,
    `Un court questionnaire sur ${sujet} est disponible. Aidez-nous à ${objectif}. ${action} et ${appel}.`,
    `Sondage : ${sujet}. Nous voulons ${objectif} et votre ${action} est essentielle. ${appel}.`,
    `Quartier à l'écoute : ${sujet}. Objectif : ${objectif}. ${action} pour faire entendre votre voix. ${appel}.`,
    `Donnez votre point de vue sur ${sujet}. Ce sondage aidera à ${objectif}. ${action}. ${appel}.`,
  ];
  return finaliserPhrase(piocherElement(gabarits));
}

// --- CAGNOTTES (POOL) ---
function genererPhraseCagnotte(): string {
  const sujet = piocherElement(poolSubjects);
  const objectif = piocherElement(poolObjectifs);
  const action = piocherElement(poolActions);
  const appel = piocherElement(poolAppels);
  const gabarits = [
    `Soutenez notre projet de ${sujet} ! Cagnotte lancée afin de ${objectif}. Chaque contribution compte. Vous pouvez ${action} et ${appel}.`,
    `Cagnotte solidaire pour ${sujet}. Notre but est de ${objectif}. N'hésitez pas à ${action} et à partager. ${appel} !`,
    `Appel à la générosité pour ${sujet} ! Pour ${objectif}, nous comptons sur vous. ${action} et ${appel}.`,
    `Mobilisons-nous pour ${sujet} ! Objectif : ${objectif}. Participez en faisant ${action}. ${appel}.`,
    `Cagnotte en cours : ${sujet}. Aidez-nous à ${objectif}. Votre ${action} fera la différence. ${appel}.`,
    `Contribuez à notre initiative : ${sujet}. Nous souhaitons ${objectif}. Un simple ${action} peut aider. ${appel}.`,
    `Unissons nos forces pour ${sujet} ! Cette collecte permettra de ${objectif}. ${action} maintenant. ${appel}.`,
    `Participez au financement de ${sujet}. Objectif : ${objectif}. Comment ? En faisant ${action}. ${appel}.`,
    `Appel aux dons pour ${sujet}. Pour ${objectif}, chaque geste compte. ${action} et diffusez. ${appel}.`,
    `Ensemble, finançons ${sujet} ! Pour ${objectif}. Vous pouvez ${action}. ${appel} pour ce projet.`,
  ];
  return finaliserPhrase(piocherElement(gabarits));
}

// --- GROUPES ---
function genererPhraseGroupe(categoryKey?: keyof typeof GroupCategory): string {
  const type = piocherElementParCategorie(groupTypesByCategory, categoryKey, groupTypesByCategory[GroupCategory.CATEGORY_5]);
  const objectif = piocherElement(groupObjectifs);
  const action = piocherElement(groupActions);
  const appel = piocherElement(groupAppels);
  const gabarits = [
    `Rejoignez notre ${type} ! Il vise ${objectif}. Ensemble, nous pouvons ${action}. ${appel}.`,
    `Bienvenue dans le ${type} axé sur ${objectif}. Si vous souhaitez ${action}, vous êtes au bon endroit. ${appel} !`,
    `Notre ${type} rassemble autour de ${objectif}. Venez ${action} avec nous. ${appel}.`,
    `Participez à la vie de notre ${type} dédié à ${objectif}. Pour ${action}, c'est par ici. ${appel}.`,
    `Envie de vous impliquer ? Le ${type} existe pour ${objectif}. Nous vous invitons à ${action}. Alors, ${appel}.`,
    `Découvrez le ${type} ! Notre principal objectif est ${objectif}. Vous pouvez ${action}. ${appel}.`,
    `Le ${type} a été créé pour ${objectif}. Nous cherchons des membres pour ${action}. ${appel}.`,
    `Intégrez notre dynamique ${type} et contribuez à ${objectif}. Votre ${action} sera précieuse. ${appel}.`,
    `Nouveau ici ? Le ${type} est idéal pour ${objectif} et ${action}. ${appel} sans tarder.`,
    `Notre ${type} se concentre sur ${objectif}. Si vous voulez ${action}, soyez le/la bienvenu(e). ${appel}.`,
  ];
  return finaliserPhrase(piocherElement(gabarits));
}

//// FONCTIONS GÉNÉRALES DE GÉNÉRATION

const minDescriptionPhrases = 2;
const maxDescriptionPhrases = 5
function genererDescription(sujet: FakerSubjects, categoryKey?: string): string {
  let phrases: string[] = [];
  const nbPhrases = Math.floor(Math.random() * (maxDescriptionPhrases - minDescriptionPhrases + 1)) + minDescriptionPhrases;
  for (let i = 0; i < nbPhrases; i++) {
    let phraseGeneree: string;
    switch (sujet) {
      case FakerSubjects.EVENT: phraseGeneree = genererPhraseEvenement(categoryKey as keyof typeof EventCategory); break;
      case FakerSubjects.SERVICE: phraseGeneree = genererPhraseService(categoryKey as keyof typeof ServiceCategory); break;
      case FakerSubjects.POST: phraseGeneree = genererPhraseAnnonce(categoryKey as keyof typeof PostCategory); break;
      case FakerSubjects.POOL: phraseGeneree = genererPhraseCagnotte(); break;
      case FakerSubjects.SURVEY: phraseGeneree = genererPhraseSondage(categoryKey as keyof typeof SurveyCategory); break;
      case FakerSubjects.GROUP: phraseGeneree = genererPhraseGroupe(categoryKey as keyof typeof GroupCategory); break;
      case FakerSubjects.MESSAGE: return genererMessageCourt();
      case FakerSubjects.AUTRE:
        phraseGeneree = finaliserPhrase(`${piocherElement(Object.values(titleWordsByKey).flat())} concernant un sujet divers qui pourrait intéresser.`);
        break;
      default:
        phraseGeneree = finaliserPhrase(`Info générale sur ${sujet}. ${piocherElement(Object.values(titleWordsByKey).flat())}.`);
    }
    if ((!phrases.includes(phraseGeneree) || phrases.length === 0) && phraseGeneree.length > 10) {
      phrases.push(phraseGeneree);
    } else if (nbPhrases > 1 && i < nbPhrases) { i--; }
  }
  return phrases.join(' ').trim();
}

function genererTitle(sujet: FakerSubjects, categoryKey?: string): string {
  let baseTitre: string = piocherElement(titleWordsByKey[sujet] || titleWordsByKey.autre);
  let complementTitre: string = '';
  let titreFinal: string;

  let categoryValue: string | undefined = undefined;
  if (categoryKey) {
    switch (sujet) {
      case FakerSubjects.EVENT: categoryValue = EventCategory[categoryKey as keyof typeof EventCategory]; complementTitre = piocherElementParCategorie(eventTypesByCategory, categoryKey as keyof typeof EventCategory, []).split(' ')[0].replace(/s$/, ''); break;
      case FakerSubjects.SERVICE: categoryValue = ServiceCategory[categoryKey as keyof typeof ServiceCategory]; complementTitre = piocherElementParCategorie(serviceTypesByCategory, categoryKey as keyof typeof ServiceCategory, []).split(' ')[0]; break;
      case FakerSubjects.POST: categoryValue = PostCategory[categoryKey as keyof typeof PostCategory]; complementTitre = piocherElementParCategorie(postObjetsByCategory, categoryKey as keyof typeof PostCategory, []); break;
      case FakerSubjects.SURVEY: categoryValue = SurveyCategory[categoryKey as keyof typeof SurveyCategory]; complementTitre = piocherElementParCategorie(surveySubjectsByCategory, categoryKey as keyof typeof SurveyCategory, []).split(' ')[0]; break;
      case FakerSubjects.GROUP: categoryValue = GroupCategory[categoryKey as keyof typeof GroupCategory]; complementTitre = piocherElementParCategorie(groupTypesByCategory, categoryKey as keyof typeof GroupCategory, []).split(' ')[0]; break;
    }
  }
  complementTitre = complementTitre.replace(/s$/, '').replace(/une? /i, '').trim();

  switch (sujet) {
    case FakerSubjects.EVENT: titreFinal = `${baseTitre} ${complementTitre || categoryValue || 'Local'}`; break;
    case FakerSubjects.SERVICE:
      const compServ = complementTitre || categoryValue || 'proximité';
      titreFinal = `${baseTitre} ${compServ?.length > 6 ? `de ${compServ}` : ''}`; break;
    case FakerSubjects.POST: titreFinal = `${baseTitre} ${complementTitre || categoryValue || 'Annonce'}`; break;
    case FakerSubjects.POOL: titreFinal = `${baseTitre} pour ${piocherElement(poolSubjects) || 'Cause Importante'}`; break;
    case FakerSubjects.SURVEY:
      const comp = complementTitre || categoryValue || 'Sujet Clé'
      titreFinal = `${baseTitre}  ${comp?.length > 6 ? `sur ${comp}` : ''}`; break;
    case FakerSubjects.GROUP: titreFinal = `${baseTitre} ${complementTitre || categoryValue || 'Ensemble'}`; break;
    case FakerSubjects.MESSAGE: titreFinal = `Message concernant ${piocherElement(linkWords)} ${piocherElement(Object.values(titleWordsByKey).flat()).toLowerCase()}`; break;
    default: titreFinal = `${baseTitre} ${categoryValue || 'du Quartier'}`;
  }
  return capitaliserPremiereLettre(titreFinal.trim().replace(/\s+/g, ' ').substring(0, 60));
}

function genererMessageCourt(): string {
  const nbPhrases = Math.floor(Math.random() * 2) + 1;
  let messageComplet: string[] = [];
  const useIntro = Math.random() > 0.5;
  const useConclusion = Math.random() > 0.5;

  if (useIntro) messageComplet.push(finaliserPhrase(piocherElement(motsTexteMessage.intro)));
  for (let i = 0; i < nbPhrases; i++) {
    messageComplet.push(finaliserPhrase(piocherElement(motsTexteMessage.corps)));
  }
  if (useConclusion) messageComplet.push(finaliserPhrase(piocherElement(motsTexteMessage.conclusion)));
  return messageComplet.join(' ').trim();
}

//// EXEMPLES DE GÉNÉRATION
console.log('--- EXEMPLES DE GÉNÉRATION (V3 - PLUS COMPLET ET COHÉRENT) ---');
Object.values(FakerSubjects).forEach(sujet => {
  if (sujet === FakerSubjects.MESSAGE || sujet === FakerSubjects.POOL || sujet === FakerSubjects.AUTRE) {
    console.log(`\n## Sujet: ${capitaliserPremiereLettre(sujet)} ##`);
    console.log('Titre:', genererTitle(sujet));
    if (sujet === FakerSubjects.MESSAGE) console.log('Message:\n', genererMessageCourt());
    else console.log('Description:\n', genererDescription(sujet));
  } else {
    let categoriesToTest: string[] = [];
    let categoryEnumType: any;
    switch (sujet) {
      case FakerSubjects.EVENT: categoriesToTest = Object.keys(EventCategory).filter(k => isNaN(Number(k))); categoryEnumType = EventCategory; break;
      case FakerSubjects.SERVICE: categoriesToTest = Object.keys(ServiceCategory).filter(k => isNaN(Number(k))); categoryEnumType = ServiceCategory; break;
      case FakerSubjects.POST: categoriesToTest = Object.keys(PostCategory).filter(k => isNaN(Number(k))); categoryEnumType = PostCategory; break;
      case FakerSubjects.SURVEY: categoriesToTest = Object.keys(SurveyCategory).filter(k => isNaN(Number(k))); categoryEnumType = SurveyCategory; break;
      case FakerSubjects.GROUP: categoriesToTest = Object.keys(GroupCategory).filter(k => isNaN(Number(k))); categoryEnumType = GroupCategory; break;
    }
    if (categoriesToTest.length > 0) {
      const randomCategoryKey = piocherElement(categoriesToTest) as keyof typeof categoryEnumType;
      console.log(`\n## Sujet: ${capitaliserPremiereLettre(sujet)} (Catégorie Clé: ${randomCategoryKey.toString()} / Nom: ${categoryEnumType[randomCategoryKey]}) ##`);
      console.log('Titre:', genererTitle(sujet, randomCategoryKey.toString()));
      console.log('Description:\n', genererDescription(sujet, randomCategoryKey.toString()));
    }
  }
  console.log('-------------------------------');
});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const customLocale: LocaleDefinition = {
  location: {
    gender_pattern: ['male', 'female'],
    city_pattern: ['Marseille'],
    street_pattern: [
      'boulevard de la corderie', 'rue de la république', 'rue de la canebière', 'traverse du moulin de la villette',
      "rue désirée clary", "rue de lyon", "rue jean cristofol", "rue félix pyat", "rue loubon",
      "boulevard roger salengro", "rue odette jasse", "rue de ruffi", "rue ibrahim ali", "rue sainte", "rue caisserie",
      "rue chevalier paul", "rue colbert", "rue de la loge", "rue du théâtre",
      "boulevard de la libération", "boulevard de strasbourg", "rue des docks", "boulevard de Dunkerque", "boulevard de Paris", "boulevard des Dames", "avenue robert schuman", "boulevard d'athènes", "cour lieutaud"
    ],
    PhoneModule: ['+33'],
    postcode: ['13001', '13002', '13003'],
    latitude: { min: 43.303, max: 43.318 },
    longitude: { min: 5.360, max: 5.375 },
    building_number: Array.from({ length: 70 }, (_, i) => (i + 1).toString()),
  },
  person: {
    gender: ['male', 'female'],
    suffix: [],
    // Add more fields as needed for your use case
  },
  internet: {
    email: {
      provider: 'citydo.com',
    },
  },
  phone_number: {
    phone_number_formats: [
      '+33 {{cell_phone}}'
    ]
  },
  lorem: {
    group: ['Bonjour', 'Collectif', 'Entraide',],
    word: [
      'bonjour', 'collectif', 'entraide', 'voisin', 'partage', 'solidarité', 'aide', 'service', 'groupe', 'événement',
      'discussion', 'message', 'projet', 'initiative', 'quartier', 'ami', 'famille', 'entraider', 'soutien', 'idée',
      'solution', 'participation', 'vote', 'sondage', 'cagnotte', 'réunion', 'partager', 'ensemble', 'problème', 'résoudre', 'bénévole'
    ],
  },

};


export const newFaker = new Faker({
  locale: [
    customLocale,
    base,
    fr
  ],

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

  return {
    zipcode,
    city,
    address,
    lat,
    lng
  }
}

const CreateRandomGroup = async (): Promise<CreateGroupDto> => {
  let addressId = newFaker.number.int({ min: 1, max });
  let Address = await prisma.address.findUnique({ where: { id: addressId } })
  if (!Address) {
    Address = await prisma.address.create({ data: await CreateRandomAddress() })
    addressId = Address.id
  }
  const category = newFaker.helpers.arrayElement(Object.values($Enums.GroupCategory));
  const name = genererTitle(FakerSubjects.GROUP, GroupCategory[category])
  return {
    addressId,
    name,
    area: newFaker.number.int({ min: 100, max: 700 }),
    rules: genererDescription(FakerSubjects.GROUP, GroupCategory[category]),
    category,
  }
}

const CreateRandomUser = async (): Promise<CreateUserDto> => {
  const password = newFaker.internet.password();
  return {
    email: newFaker.internet.email({ provider: 'collectif.com' }),
    password,
    status: $Enums.UserStatus.ACTIVE,
  }
}

const CreateRandomGroupUser = (): CreateGroupUserDto => {
  return {
    groupId: newFaker.number.int({ min: 1, max: 2 }),
    userId: newFaker.number.int({ min: 1, max }),
    role: newFaker.helpers.arrayElement([$Enums.Role.MEMBER, $Enums.Role.MODO]),
  }
}

const CreateRandomProfile = async (): Promise<CreateProfileDto> => {
  let addressId = newFaker.number.int({ min: 1, max });
  let Address = await prisma.address.findUnique({ where: { id: addressId } })
  if (!Address) {
    Address = await prisma.address.create({ data: await CreateRandomAddress() })
    addressId = Address.id
  }
  let gender = newFaker.person.gender();
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    Address: Address,
    addressId: Address.id,
    firstName: newFaker.person.firstName(gender === 'male' ? 'male' : 'female'),
    lastName: newFaker.person.lastName(),
    phone: newFaker.phone.number({ style: 'international' }),
    image: newFaker.image.personPortrait({ sex: gender === 'male' ? 'male' : 'female' }),
    addressShared: newFaker.datatype.boolean(),
    mailSub: $Enums.MailSubscriptions.SUB_1,
    assistance: newFaker.helpers.arrayElement(Object.values($Enums.AssistanceLevel)),
    points: newFaker.number.int({ min: 5, max: 50 }),
    skills: newFaker.lorem.words({ min: 0, max: 3 }),
  }
}

const CreateRandomEvent = async (): Promise<CreateEventDto> => {
  let createdAt = newFaker.date.past({ refDate: now, years: 0.1 });
  const start = newFaker.date.future({ refDate: createdAt, years: 0.5 });
  const days = newFaker.number.int({ min: 1, max: 4 });
  const status = $Enums.EventStatus.PENDING;
  let end: Date;
  days === 1 ? (end = new Date(start.getTime() + 24 * 60 * 60 * 1000)) : (end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000));
  let addressId = newFaker.number.int({ min: 1, max });
  let Address = await prisma.address.findUnique({ where: { id: addressId } })
  if (!Address) {
    Address = await prisma.address.create({ data: await CreateRandomAddress() })
    addressId = Address.id
  }
  let user = await prisma.user.findUnique({ where: { id: newFaker.number.int({ min: 1, max: max / 3 }) }, include: { GroupUser: true } });
  let groupIds = user ? user.GroupUser.map(g => g.groupId) : [];
  const category = newFaker.helpers.arrayElement(Object.values($Enums.EventCategory));


  return {
    userId: user.id,
    Address,
    addressId,
    title: genererTitle(FakerSubjects.EVENT, EventCategory[category]),
    description: genererDescription(FakerSubjects.EVENT, EventCategory[category]),
    start,
    end,
    category,
    participantsMin: newFaker.number.int({ min: 1, max: 20 }),
    //image,
    image: newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false, }),
    groupId: newFaker.helpers.arrayElement(groupIds),
    createdAt,
    status,
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
  let user = await prisma.user.findUnique({ where: { id: newFaker.number.int({ min: 1, max: max / 3 }) }, include: { GroupUser: true } });
  let groupIds = user ? user.GroupUser.map(g => g.groupId) : [];
  const category = newFaker.helpers.arrayElement(Object.values($Enums.ServiceCategory));
  return {
    userId: user.id,
    type: newFaker.helpers.arrayElement(Object.values($Enums.ServiceType)),
    title: genererTitle(FakerSubjects.SERVICE, ServiceCategory[category]),
    description: genererDescription(FakerSubjects.SERVICE, ServiceCategory[category]),
    category,
    skill,
    hard,
    status,
    image: (newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
    groupId: newFaker.helpers.arrayElement(groupIds),
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
  const userIdModo = newFaker.helpers.arrayElement(modos.map(m => m.id));
  const userIdModoOn = ((userId !== service.userIdResp && status === $Enums.IssueStep.STEP_0)) ? null : newFaker.helpers.arrayElement(modos.map(m => (m.id !== userIdModo) && m.id))
  return {
    status,
    serviceId: service.id,
    userIdModo,
    userIdModoOn,
    userId,
    description: genererDescription(FakerSubjects.AUTRE, 'Problème'),
    date: newFaker.date.recent({ days: 30 }),
    image: newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false }),
  }
}

const CreateRandomPost = async (): Promise<CreatePostDto> => {
  let user = await prisma.user.findUnique({ where: { id: newFaker.number.int({ min: 1, max: max / 3 }) }, include: { GroupUser: true } });
  let groupIds = user ? user.GroupUser.map(g => g.groupId) : [];
  const category = newFaker.helpers.arrayElement(Object.values($Enums.PostCategory));

  return {
    userId: user.id,
    title: genererTitle(FakerSubjects.POST, PostCategory[category]),
    description: genererDescription(FakerSubjects.POST, PostCategory[category]),
    category,
    image: (newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false })),
    share: newFaker.helpers.arrayElement(Object.values($Enums.Share)),
    groupId: newFaker.helpers.arrayElement(groupIds),
  }
}

const CreateRandomLike = (): CreateLikeDto => {
  return {
    userId: newFaker.number.int({ min: 1, max: max / 3 }),
    postId: newFaker.number.int({ min: 1, max }),
  }
}

const CreateRandomPool = async (): Promise<CreatePoolDto> => {
  let user = await prisma.user.findUnique({ where: { id: newFaker.number.int({ min: 1, max: max / 3 }) }, include: { GroupUser: true } })
  let userBenef = await prisma.user.findUnique({ where: { id: newFaker.number.int({ min: 1, max: max / 3 }) }, include: { GroupUser: true, Profile: true } });
  let groupIds = user ? user.GroupUser.map(g => g.groupId) : [];
  let groupId = newFaker.helpers.arrayElement(groupIds);
  const count = await prisma.user.count({ where: { GroupUser: { some: { groupId } } } })
  const neededVotes = Math.ceil(count / 2);
  return {
    userId: user.id,
    userIdBenef: userBenef.id,
    title: genererTitle(FakerSubjects.POOL, userBenef.Profile?.firstName),
    description: genererDescription(FakerSubjects.POOL, userBenef.Profile?.firstName),
    groupId,
    neededVotes,
  }
}

const CreateRandomSurvey = async (): Promise<CreateSurveyDto> => {
  let user = await prisma.user.findUnique({ where: { id: newFaker.number.int({ min: 1, max: max / 3 }) }, include: { GroupUser: true } });
  let groupIds = user ? user.GroupUser.map(g => g.groupId) : [];
  let groupId = newFaker.helpers.arrayElement(groupIds);
  const count = await prisma.user.count({ where: { GroupUser: { some: { groupId } } } })
  const neededVotes = Math.ceil(count / 2);
  const category = newFaker.helpers.arrayElement(Object.values($Enums.SurveyCategory));
  return {
    userId: user.id,
    title: genererTitle(FakerSubjects.SURVEY, SurveyCategory[category]),
    description: genererDescription(FakerSubjects.SURVEY, SurveyCategory[category]),
    category,
    groupId,
    image: newFaker.image.urlPicsumPhotos({ width: 600, height: 400, blur: 0, grayscale: false }),
    neededVotes,
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
    message: genererMessageCourt(),
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
    while (await prisma.address.count() < max * 2) {
      const newAddress = await CreateRandomAddress();
      const exist = await prisma.address.findUnique({ where: { address_zipcode: { address: newAddress.address, zipcode: newAddress.zipcode } } })
      if (!exist) await addressService.create(newAddress)
    }
  }
  await Address()
  console.log('addresses created ✅ ')

  // GROUP fk address
  const Group = async () => {
    while (await prisma.group.count() < 2) {
      const groupeDTO = await CreateRandomGroup();
      const res = await groupsService.create(groupeDTO)
      console.log('group created', res)
    }
  }
  await Group()
  console.log('groups created ✅ ')

  // GROUPUSER fk user fk group
  const groupUser = async () => {
    await prisma.groupUser.create({ data: { userId: 1, groupId: 1, role: $Enums.Role.MODO } })
    await prisma.groupUser.create({ data: { userId: 2, groupId: 1, role: $Enums.Role.MODO } })
    await prisma.groupUser.create({ data: { userId: 2, groupId: 2, role: $Enums.Role.MODO } })
    while (await prisma.groupUser.count() < max / 1.5) {
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
      data: { userId: 1, addressId: 1, firstName: 'Testeur', lastName: 'Test', phone: '+33606060606', image: 'https://avatars.githubusercontent.com/u/71236683?v=4', addressShared: true, mailSub: $Enums.MailSubscriptions.SUB_1, }
    })
    await prisma.profile.create({
      data: { userId: 2, addressId: 2, firstName: 'Loraine', lastName: 'Marseille', phone: '+33606060606', image: 'https://image-uniservice.linternaute.com/image/450/7/1397936247/2954633.jpg', addressShared: true, mailSub: $Enums.MailSubscriptions.SUB_2, }
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


  // EVENT  
  const event = async () => {
    while (await prisma.event.count() < max) {
      await eventService.create(await CreateRandomEvent())
    }
  }
  await event()
  console.log('events created ✅ ')


  //  PARTICIPANT 
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
    while (await prisma.service.count() < max * 2) {
      const { userId, ...service } = await CreateRandomService();
      let serviceCreated = await servicesService.create({ userId, ...service })
      if (serviceCreated.status !== $Enums.ServiceStep.STEP_0) {
        let userIdResp: number;
        do {
          userIdResp = newFaker.number.int({ min: 1, max: max / 3 });
        } while (userIdResp === userId);
        serviceCreated = await prismaService.service.update({
          where: { id: serviceCreated.id },
          data: { userIdResp },
        })

        if (serviceCreated.status === $Enums.ServiceStep.STEP_4 && serviceCreated.userIdResp) {
          const creatIssueDto: CreateIssueDto = await CreateRandomIssue(serviceCreated)
          await issuesService.create(creatIssueDto)
        }
      }
    }
  }
  await service()
  console.log('services & issuescreated ✅ ')


  // POST  
  const post = async () => {
    while (await prisma.post.count() < max) {
      await postsService.create(await CreateRandomPost())
    }
  }
  await post()
  console.log('posts created ✅ ')


  // LIKE 
  const like = async () => {
    while (await prisma.like.count() < max * 2) {
      const { userId, postId, ...like } = CreateRandomLike();
      const cond = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });
      if (!cond) await likesService.create({ ...like, userId, postId })
    }
  }
  await like()
  console.log('likes created ✅ ')


  // POOL 
  const pool = async () => {
    while (await prisma.pool.count() < max) {
      const { userId, userIdBenef, groupId, ...poolData } = await CreateRandomPool();
      const cond = await prisma.pool.findFirst({ where: { userId: userId, userIdBenef: userIdBenef } })
      if (!cond && (userId !== userIdBenef)) await prisma.pool.create({
        data: {
          User: { connect: { id: userId } },
          UserBenef: { connect: { id: userIdBenef } },
          Group: { connect: { id: groupId } },
          ...poolData,
        }
      })
    }
  }
  await pool()
  console.log('pools created ✅ ')


  // SURVEY fk user 
  const survey = async () => {
    while (await prisma.survey.count() < max) {
      const { userId, groupId, ...survey } = await CreateRandomSurvey();
      await prisma.survey.create({
        data: {
          ...survey,
          Group: { connect: { id: groupId } },
          User: { connect: { id: userId } }
        }
      })
    }
  }
  await survey()
  console.log('surveys created ✅ ')


  // VOTE fk user 
  const vote = async () => {
    while (await prisma.vote.count() < max * 8) {
      const { userId, targetId, target, ...vote } = await CreateRandomVote();
      const cond = await prisma.vote.findUnique({ where: { userId_target_targetId: { userId, target, targetId } } });
      const targetFind = (async () => {
        switch (target) {
          case $Enums.VoteTarget.POOL:
            return prisma.pool.findUnique({ where: { id: targetId, status: $Enums.PoolSurveyStatus.PENDING } });
          case $Enums.VoteTarget.SURVEY:
            return prisma.survey.findUnique({ where: { id: targetId, status: $Enums.PoolSurveyStatus.PENDING } });
        }
      })
      const targetExists = await targetFind();
      if (!cond && targetExists) await votesService.create({ ...vote, userId, targetId, target })
    }
  }
  await vote();
  console.log('votes created ✅ ')

  // MESSAGE fk user
  const message = async () => {
    while (await prisma.message.count() < max * 4) {
      const { userId, userIdRec, ...message } = await CreateRandomMessage();
      await messagesService.create({ ...message, userId, userIdRec })
    }
  }
  await message()
  console.log('messages created ✅ ')

  // FLAG fk user
  const flag = async () => {
    while (await prisma.flag.count() < max * 2) {
      const { userId, target, targetId, ...flag } = await CreateRandomFlag();
      const cond = await prisma.flag.findUnique({ where: { userId_target_targetId: { userId, target, targetId } } });
      const findTarget = async () => {
        switch (target) {
          case $Enums.FlagTarget.POST:
            return prisma.post.findUnique({ where: { id: targetId } });
          case $Enums.FlagTarget.SERVICE:
            return prisma.service.findUnique({ where: { id: targetId } });
          case $Enums.FlagTarget.EVENT:
            return prisma.event.findUnique({ where: { id: targetId } });
          case $Enums.FlagTarget.SURVEY:
            return prisma.survey.findUnique({ where: { id: targetId } });
          default:
            return null;
        }
      }
      const con2 = await findTarget();
      if (!cond && con2) await flagsService.create({ ...flag, userId, target, targetId })
    }
  }
  await flag();
  console.log('flags created ✅ ')
}



seed().then(() => console.log('seed finished successfully ✅✅✅')).finally(async () => { await prisma.$disconnect() }).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})

