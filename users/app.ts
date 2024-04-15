import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import appRouter from "./src/routes";
import { DbConnection, kafkaClient } from "./src/utils";
import { errorHandler } from "@node_helper/error-handler";
import { UserDeleteTopic, UserEnableDisableTopic, UserRegisterConsumer, UserUpdateTopic } from "src/modules/users";
import { dbErrorHandler } from "src/middleware";

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
    this.app.use(morgan("dev"));
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
    new UserUpdateTopic(kafkaClient).createTopicIfNotExits(1);
    new UserEnableDisableTopic(kafkaClient).createTopicIfNotExits(1);
    new UserDeleteTopic(kafkaClient).createTopicIfNotExits(1);
  }

  private async kafkaConsumer() {
    try {
      new UserRegisterConsumer(kafkaClient).consume();
    } catch (error) {
      console.error("consumed error:", error);
    }
  }

  private async errorHandlerMiddleware() {
    this.app.use(dbErrorHandler);
    this.app.use(errorHandler);
  }
}
