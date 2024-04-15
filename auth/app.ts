import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import appRouter from "./src/routes";
import { DbConnection, Logger, kafkaClient } from "./src/utils";
import { errorHandler } from "@node_helper/error-handler";
import { AuthDeleteConsumer, AuthEnableDisableConsumer, AuthUpdateConsumer, AuthUserCreateTopic } from "src/modules/auth";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoute();
    this.dbConnector();
    this.kafkaConfig();
    this.errorHandlerMiddleware();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());

    this.app.use(
      morgan("dev", {
        stream: {
          write(message: string) {
            const logger = Logger();
            return logger.http(message.replace(/\n$/, ""));
          },
        },
      })
    );
    this.app.set("rateLimit", 100);

    this.app.use(helmet());
    this.app.use("/public", express.static(path.join(__dirname, "public")));

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: false }));
  }

  private configureRoute(): void {
    this.app.use("/api/v1", appRouter);
  }

  private dbConnector(): void {
    new DbConnection().connect();
  }

  private async kafkaConfig() {
    await this.kafkaTopicCreator();
    await this.kafkaConsumer();
  }

  private async kafkaTopicCreator() {
    new AuthUserCreateTopic(kafkaClient).createTopicIfNotExits(1);
  }

  private async kafkaConsumer() {
    try {
      new AuthUpdateConsumer(kafkaClient).consume();
      new AuthEnableDisableConsumer(kafkaClient).consume();
      new AuthDeleteConsumer(kafkaClient).consume();
    } catch (error) {
      console.error("consumed error:", error);
    }
  }

  private async errorHandlerMiddleware() {
    this.app.use(errorHandler);
  }
}
