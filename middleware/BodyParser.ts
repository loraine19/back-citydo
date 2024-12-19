import { plainToClass } from 'class-transformer';

export function parseData(dto: any) {
    for (const key in dto) {
        if (typeof dto[key] === 'string' && !isNaN(Number(dto[key]))) {
            dto[key] = Number(dto[key]);
        }
    }
    return dto;
}