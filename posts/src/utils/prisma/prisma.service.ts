import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        });
    }

    async onModuleInit() {
        await this.$connect()
            .then(() => console.log('Database connected successfully..'))
            .catch((err) => console.log('Unable to connect database..', err));
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
