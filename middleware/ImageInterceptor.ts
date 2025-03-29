import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

// est ce que je dois rester dans dist ou je dois aller dans src ? changer dans les routes si besoin 
@Injectable()
export class ImageInterceptor {
    static create(element: string) {
        return FileInterceptor('image', {
            storage: diskStorage({
                destination: './dist/public/images/' + element,
                filename: (req, file, cb) => {
                    const extension = file.mimetype.split('/')[1];
                    cb(null, `${element}-${Date.now()}.${extension}`);
                },
            }),
            preservePath: true,
            limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
        });
    }

    static deleteImage(filePath: string, directory?: string) {
        const fullPath = path.resolve(filePath.replace(process.env.STORAGE, 'dist'))
        const dirName = directory ?? path.dirname(fullPath).split(path.sep).pop();
        const rootPath = path.join(__dirname, '..', 'public')
        const dir = path.join(rootPath, 'images', dirName);
        const files = fs.readdirSync(dir);
        if (!files) return true;
        else fs.unlink(fullPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted:', fullPath);
            }
        });
        return true;
    }
}