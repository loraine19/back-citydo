import { File } from "@prisma/client";

export class UploadEntity implements File {
    id: number;
    originalname: string;
    path: string;
    mimeType: string;
}
