import { plainToClass } from 'class-transformer';
import { log } from 'console';

export function parseData(dto: any, image?: Express.Multer.File) {
    for (const key in dto) {
        if (key.includes('Id') && typeof dto[key] === 'string' && !isNaN(Number(dto[key]))) {
            dto[key] = parseInt(dto[key]);
        }
        if (key.includes('Min') && typeof dto[key] === 'string' && !isNaN(Number(dto[key]))) {
            dto[key] = parseInt(dto[key]);
        }
        if (key === 'phone' && typeof dto[key] !== 'string') {
            dto[key] = String(dto[key]);
        }
        if (typeof dto[key] === 'string' && dto[key] === 'true') {
            dto[key] = true;
        }
        if (typeof dto[key] === 'string' && dto[key] === 'false') {
            dto[key] = false;
        }
        if (key === 'Address' && typeof dto[key] === 'string') {
            dto['Address'] = JSON.parse(dto[key]);
        }

    }

    (image && typeof image === 'object') && (dto = { ...dto, image: process.env.STORAGE + image.path.replace('dist', '') })
    return dto;
}

export const getDate = (days: number): Date => {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}