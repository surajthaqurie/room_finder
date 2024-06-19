import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get<string>("DATABASE_URL")
                }
            }
        });
    }

    async onModuleInit() {
        await this.$connect()
            .then(() => console.log("Database connected successfully.."))
            .catch((err) => console.log("Unable to connect database..", err));
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
