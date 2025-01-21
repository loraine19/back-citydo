import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            log: [
                // {
                //     level: 'query', // Log les requêtes SQL
                //     emit: 'stdout', // Affiche-les dans la stdout
                // },
                {
                    level: 'info', // Log les informations supplémentaires
                    emit: 'stdout',
                },
                {
                    level: 'warn', // Log les avertissements
                    emit: 'stdout',
                },
                {
                    level: 'error', // Log les erreurs
                    emit: 'stdout',
                },
            ],
        });

    }
    async onModuleInit() {
        await this.$connect();
    }


    async enableShutdownHooks(app: INestApplication) {
        await app.close()
    }
}