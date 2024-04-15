import { KAFKA_TOPIC } from "src/common/enum";
import { BaseAdminTopic } from "src/utils";

export class AuthUserCreateTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_CREATE;
}
