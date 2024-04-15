import { KAFKA_TOPIC } from "src/common/enum";
import { BaseAdminTopic } from "src/utils";

export class UserUpdateTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_UPDATE;
}

export class UserEnableDisableTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_ENABLE_DISABLE;
}

export class UserDeleteTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_DELETE;
}
