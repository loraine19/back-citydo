import { plainToClass } from 'class-transformer';
import { log } from 'console';

export function parseData(dto: any, image?: Express.Multer.File) {
    for (const key in dto) {
        if (typeof dto[key] === 'string' && !isNaN(Number(dto[key]))) {
            dto[key] = parseInt(dto[key]);
        }
        if (typeof dto[key] === 'string' && dto[key] === 'true') {
            dto[key] = true;
        }
        if (typeof dto[key] === 'string' && dto[key] === 'false') {
            dto[key] = false;
        }

    }
    image && (dto = { ...dto, image: process.env.STORAGE + image.path.replace('dist', '') })
    return dto;
}