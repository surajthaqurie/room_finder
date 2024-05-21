import { AuthGuard } from "@nestjs/passport";

export class isAuthenticate extends AuthGuard("jwt") {
    constructor() {
        super();
    }
}
