import { KAFKA_TOPIC } from "src/common/enum";
import { BaseAdminTopic } from "src/utils";

export class AuthUserCreateTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_CREATE;
}

export class AuthUserUpdateTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_UPDATE;
}

export class AuthUserEnableDisableTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_ENABLE_DISABLE;
}

export class AuthUserDeleteTopic extends BaseAdminTopic {
  topic = KAFKA_TOPIC.USER_DELETE;
}
