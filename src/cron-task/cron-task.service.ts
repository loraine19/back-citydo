import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { $Enums } from '@prisma/client';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
const fs = require('fs');
const path = require('path');

@Injectable()
export class CronTaskService {

    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private jwtService: JwtService) { }

    createdOneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    createdTwoWeeksAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    createdOneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    userSelectConfig = { User: { select: { id: true, email: true, Profile: { select: { mailSub: true } } } } }

    @Cron(CronExpression.EVERY_2_HOURS)
    async checkExpiredElement() {
        const surveys = await this.prisma.survey.findMany({
            where: { createdAt: { lt: this.createdTwoWeeksAgo }, status: $Enums.PoolSurveyStatus.PENDING },
            include: this.userSelectConfig
        })
        const pools = await this.prisma.pool.findMany({
            where: { createdAt: { lt: this.createdTwoWeeksAgo }, status: $Enums.PoolSurveyStatus.PENDING },
            include: this.userSelectConfig
        })
        const events = await this.prisma.event.findMany({
            where: { createdAt: { lt: this.createdTwoWeeksAgo }, status: $Enums.EventStatus.PENDING },
            include: this.userSelectConfig
        })

        const notification = (typeEnum: $Enums.NotificationType, type: string, title: string, id: number) => ({
            type: typeEnum,
            level: $Enums.NotificationLevel.SUB_3,
            title: `${type} est expiré`,
            description: `votre ${type} ${title} n'a pas pu atteindre la majorité en 2 semaines. Il est donc maintenant rejeté`,
            link: `/${type}/${id}`
        })

        for (const survey of surveys) {
            await this.prisma.survey.update({
                where: { id: survey.id },
                data: { status: $Enums.PoolSurveyStatus.REJECTED }
            })

            await this.notificationsService.create(new UserNotifInfo(survey.User), notification($Enums.NotificationType.SURVEY, 'sondage', survey.title, survey.id))
        }

        for (const pool of pools) {
            await this.prisma.pool.update({
                where: { id: pool.id },
                data: { status: $Enums.PoolSurveyStatus.REJECTED }
            })
            await this.notificationsService.create(new UserNotifInfo(pool.User), notification($Enums.NotificationType.POOL, 'cagnotte', pool.title, pool.id))
        }

        for (const event of events) {
            await this.prisma.event.update({
                where: { id: event.id },
                data: { status: $Enums.EventStatus.REJECTED }
            })
            await this.notificationsService.create(new UserNotifInfo(event.User), notification($Enums.NotificationType.EVENT, 'événement', event.title, event.id))
        }
    }

    /// DELETE EXPIRED TOKENS
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    deleteExpiredTokens() {
        this.prisma.token.deleteMany({
            where: {
                expiredAt: { lt: new Date(Date.now()) }
            }
        })
    }

    /// READ OLD NOTIFICATIONS
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
