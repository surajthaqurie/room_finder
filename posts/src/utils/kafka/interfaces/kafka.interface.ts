import { KAFKA_EVENT } from "../enums";

export interface IMessagePayload<T> {
    key: string;
    data: T[];
    event: KAFKA_EVENT;
}
