import { plainToClass } from 'class-transformer';
import { log } from 'console';

export function parseData(dto: any) {
    for (const key in dto) {
        if (typeof dto[key] === 'string' && !isNaN(Number(dto[key]))) {
            dto[key] = parseInt(dto[key]);
        }
    }
    return dto;
}