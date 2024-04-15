import { createServer, Server } from "http";
import { App } from "./app";
import { Application } from "express";
import { env } from "./src/configs";

class CreateServer {
  public server: Server;
  private port: number;
  private app: Application;

  constructor(port: number) {
    this.app = new App().app;

    this.server = createServer(this.app);
    this.port = port;
    this.server.listen(this.port, (): void => {
      console.log(`Server is starting on ${env.appConfig.APP_URL} at ${new Date()} with process id:`, process.pid);
      console.log(`Swagger API docs is  started on ${process.env.APP_URL}/api-docs`);
    });
  }
}

const PORT: number = Number(env.appConfig.PORT) || 8848;
const server = new CreateServer(PORT).server;

process.on("SIGTERM", (): void => {
  console.log("Server is closing at ", new Date());
  server.close();
});

process.on("SIGINT", (): void => {
  console.log("Server is closing at ", new Date());
  server.close();
});

export default server;
