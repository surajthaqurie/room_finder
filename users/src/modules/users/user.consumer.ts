import { KAFKA_TOPIC } from "src/common/enum";
import { IUserRegister } from "src/common/interfaces";
import { BaseConsumer } from "src/utils";
import { UserService } from "./user.service";
import { Kafka } from "kafkajs";

export class UserRegisterConsumer extends BaseConsumer<{ data: IUserRegister }> {
  topic: KAFKA_TOPIC = KAFKA_TOPIC.USER_CREATE;
  groupId: string = "UserRegisterGroup";

  userService: UserService;

  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
    this.userService = new UserService();
  }

  async callback(value: IUserRegister): Promise<void> {
    await this.userService.registerUser(value);
  }
}
