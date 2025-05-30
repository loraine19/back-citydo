import * as path from 'path';
import * as fs from 'fs';

interface PixabayHit {
    id: number;
    pageURL: string;
    type: string;
    tags: string;
    webformatURL: string;
}

interface PixabayApiResponse {
    total: number;
    totalHits: number;
    hits: PixabayHit[];
}

export enum PIXABAY_ORIENTATION {
    ALL = 'all',
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
}
export enum PIXABAY_CATEGORY {
    BACKGROUNDS = 'backgrounds',
    FASHION = 'fashion',
    NATURE = 'nature',
    SCIENCE = 'science',
    EDUCATION = 'education',
    FEELINGS = 'feelings',
    HEALTH = 'health',
    PEOPLE = 'people',
    RELIGION = 'religion',
    PLACES = 'places',
    ANIMALS = 'animals',
    INDUSTRY = 'industry',
    COMPUTER = 'computer',
    FOOD = 'food',
    SPORTS = 'sports',
    TRANSPORTATION = 'transportation',
    TRAVEL = 'travel',
    BUILDINGS = 'buildings',
    BUSINESS = 'business',
    MUSIC = 'music'
}

interface GetRandomPixabayImageOptions {
    perPage?: number;
    orientation?: PIXABAY_ORIENTATION;
    category?: PIXABAY_CATEGORY;
}

function normalizeKeyword(keyword: string): string {
    return keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

export function getImageUrlLocal(keywords: string[]): string {
    let imageUrl = '';
    let imagesSeederDir = path.join(__dirname, 'imagesSeeder');
    // process.env.NODE_ENV === 'dev' && (
    imagesSeederDir = imagesSeederDir.replace('dist', '')
    let selectedFile = 'voisins.json';
    try {
        const files = fs.readdirSync(imagesSeederDir);
        const jsonFiles = files.filter((file: string) => file.endsWith('.json'));
        const fileNames = jsonFiles.map((file: string) => path.basename(file, '.json').toLowerCase());
        const found = keywords.find((keyword: string) => {
            if (keyword) {
                return fileNames.includes(normalizeKeyword(keyword));
            }
            else return false
        });
        if (found) selectedFile = `${normalizeKeyword(found)}.json`
    } catch (err) {
        console.error('Erreur lors de la lecture du dossier :', err);
    }
    const jsonFilePath = path.join(imagesSeederDir, selectedFile);
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    if (jsonData.hits && jsonData.hits.length > 0) {
        let arrayOfImages = jsonData.hits.filter((hit: PixabayHit) => {
            if (!hit.tags || typeof hit.tags !== 'string') return false;
            return hit.tags.toLowerCase().split(',').some((tag: string) =>
                keywords.some(keyword => {
                    return normalizeKeyword(tag) === normalizeKeyword(keyword)
                }))
        });
        if (arrayOfImages.length === 0) arrayOfImages = jsonData.hits;
        const randomIndex = Math.floor(Math.random() * arrayOfImages.length);
        const randomImage = arrayOfImages[randomIndex];
        imageUrl = randomImage.webformatURL;
    }
    return imageUrl
}

export async function getRandomPixabayImageUrl(
    apiKey: string,
    keywords: string[],
    options?: GetRandomPixabayImageOptions
): Promise<string | null> {

    if (!apiKey) return getImageUrlLocal(keywords);
    if (!keywords || keywords.length === 0) return getImageUrlLocal(['voisins', 'quartier']);

    const perPage = options?.perPage ?? 200 //maximum allowed by Pixabay
    const orientation = options?.orientation ?? PIXABAY_ORIENTATION.ALL
    const queryKeywords = encodeURIComponent(keywords.join('+'));
    let apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${queryKeywords}&lang=fr&image_type=photo&per_page=${perPage}&orientation=${orientation}`;

    if (options?.category) apiUrl += `&category=${encodeURIComponent(options.category)}`
    apiUrl += `&safesearch=true&order=popular`; // 'popular' ou 'latest' pour varier

    const response = await fetch(apiUrl);
    const data: PixabayApiResponse = await response.json();
    if (data.hits && data.hits.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.hits.length);
        const randomImage = data.hits[randomIndex];
        return randomImage.webformatURL; // Retourne l'URL souhaitée
    } else return getImageUrlLocal(keywords);

}

const test = async () => {
    const imageUrl = await getRandomPixabayImageUrl(process.env.PIXABAY_API_KEY, ['féminin', 'femme', 'fille']);
    console.log(imageUrl);
}
test().catch(console.error);

