import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
const fs = require('fs');
const path = require('path');

@Injectable()
export class CronTaskService {

    constructor(private prisma: PrismaService) { }

    createdOneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    createdOneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    @Cron(CronExpression.EVERY_WEEK)
    deleteReadNotifs() {
        this.prisma.notification.deleteMany({
            where: { read: true, updatedAt: { lt: this.createdOneWeekAgo } },
        })
    }

    @Cron(CronExpression.EVERY_WEEK)
    deleteOldNotifs() {
        this.prisma.notification.deleteMany({
            where: { createdAt: { lt: this.createdOneMonthAgo } }
        })
    }

    @Cron(CronExpression.EVERY_WEEK)
    async deleteOldPhotos() {
        const rootPath = path.join(__dirname, '..', '..', 'public')

        const clean = async (dirName: string, genericPrisma: any) => {
            const dir = path.join(rootPath, 'images', dirName);
            const files = fs.readdirSync(dir);
            if (!files) return;
            for (const file of files) {

                const isInDb = await genericPrisma(file);
                if (!isInDb) {
                    console.log('file not in db', file);
                    fs.unlinkSync(path.join(dir, file));
                }
            }
        }

        await clean('issues', (file: string) => this.prisma.issue.findFirst({ where: { image: file } }));
        await clean('profiles', (file: string) => this.prisma.profile.findFirst({ where: { image: file } }));
        await clean('events', (file: string) => this.prisma.event.findFirst({ where: { image: file } }));
        await clean('posts', (file: string) => this.prisma.post.findFirst({ where: { image: file } }));
        await clean('surveys', (file: string) => this.prisma.survey.findFirst({ where: { image: file } }));
    }



}
