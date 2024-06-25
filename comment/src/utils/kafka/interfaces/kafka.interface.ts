import { KAFKA_EVENT, KAFKA_TOPIC } from "../enums";

export interface IMessagePayload<T> {
    key: KAFKA_TOPIC;
    data: T[];
    event: KAFKA_EVENT;
}
