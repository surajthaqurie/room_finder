import mongoose from "mongoose";
import { env } from "../configs";

export class DbConnection {
  public connect() {
    mongoose
      .connect(env.dbConfig.DATABASE_URL, { dbName: env.appConfig.APP_NAME.toLowerCase() })
      .then(() => console.log("Database Connected Successfully !!"))
      .catch((err) => console.log("Database could not connect", err));
  }
}
