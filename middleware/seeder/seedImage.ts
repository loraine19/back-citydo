import * as path from 'path';
import * as fs from 'fs';

interface PixabayHit {
    id: number;
    pageURL: string;
    type: string;
    tags: string;
    webformatURL: string;
    largeImageURL: string;
    previewURL: string;
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
    if (!keyword || typeof keyword !== 'string') return '';
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
        const fileNames = jsonFiles.map((file: string) => path.basename(file, '.json').toLowerCase())
        let match = []
        for (const keyword of keywords) {
            fileNames.forEach((fileName: string) => {
                if (normalizeKeyword(keyword) === normalizeKeyword(fileName)) {
                    match.push(fileName)
                }
            })
        }
        if (match.length > 0) selectedFile = `${match[0]}.json`
        // else {
        //     const randomIndex = Math.floor(Math.random() * jsonFiles.length);
        //     selectedFile = jsonFiles[randomIndex];
        // }
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
        imageUrl = randomImage.previewURL.replace('_150', '_1280');
    }
    return imageUrl
}

export async function getRandomPixabayImageUrl(
    keywords: string[],
    options?: GetRandomPixabayImageOptions
): Promise<string | null> {

    const apiKey = process.env.PIXABAY_API_KEY;
    if (!apiKey) return getImageUrlLocal(keywords);
    if (!keywords || keywords.length === 0) return getImageUrlLocal(['voisins', 'quartier']);

    const perPage = options?.perPage ?? 200 //maximum allowed by Pixabay
    const orientation = options?.orientation ?? PIXABAY_ORIENTATION.ALL
    const queryKeywords = encodeURIComponent(keywords.join('+'));
    let apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${queryKeywords}&lang=fr&image_type=photo&per_page=${perPage}&orientation=${orientation}`;

    if (options?.category) apiUrl += `&category=${encodeURIComponent(options.category)}`
    apiUrl += `&safesearch=true&order=popular`; // 'popular' ou 'latest' pour varier

    let url = ''
    try {
        const response = await fetch(apiUrl);
        const data: PixabayApiResponse = await response.json();
        if (data.hits && data.hits.length > 0) {
            const filteredHits = data.hits.sort((a, b) => {
                const aTags = a.tags ? a.tags.toLowerCase().split(',') : [];
                const bTags = b.tags ? b.tags.toLowerCase().split(',') : [];
                const aMatch = aTags.some(tag => keywords.includes(normalizeKeyword(tag)));
                const bMatch = bTags.some(tag => keywords.includes(normalizeKeyword(tag)));
                return (bMatch ? 1 : 0) - (aMatch ? 1 : 0)
            })
            const randomIndex = Math.floor(Math.random() * 5);
            const randomImage = filteredHits[randomIndex];
            url = randomImage?.previewURL.replace('_150', '_1280');
            getImageUrlLocal(keywords)
        } else {
            console.warn('No images found for keywords:', keywords);
            url = getImageUrlLocal(keywords);
            if (!url) {
                console.warn('No local image found, returning null');
                return null;
            }
        }
    } catch (err) {
        console.error('Error fetching from Pixabay API:', err);
        url = getImageUrlLocal(keywords);
    }

    console.log('url', url, 'keywords', keywords)
    return url || null;
}

const test = async () => {
    const imageUrl = await getRandomPixabayImageUrl(['chat', 'animal']);
    console.log(imageUrl);
}
//test().catch(console.error);

