import { ILoginPayload, ISignupPayload, IAuthUpdatePayload, ISignupResponse } from "src/common/interface";
import { AUTH_MESSAGE_CONSTANT } from "src/common/constant";
import { Auth } from "./auth.schema";
import { AuthRegisterProducer } from "./auth.producer";
import { updateValidation } from "./auth.validation";
import { BadRequestError, BcryptHelper, ConflictRequestError, JsonWebToken, NotFoundError } from "src/utils";
import { env } from "src/configs";

export class AuthService {
    bcryptHelper: BcryptHelper;
    jsonWebToken: JsonWebToken;

    constructor() {
        this.bcryptHelper = new BcryptHelper();
        this.jsonWebToken = new JsonWebToken();
    }

    public async signup(payload: ISignupPayload): Promise<ISignupResponse> {
        if (payload.password !== payload.confirmPassword) throw new BadRequestError(AUTH_MESSAGE_CONSTANT.PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCHED);

        const email_taken = await Auth.findOne({ email: payload.email });
        if (email_taken) throw new ConflictRequestError(AUTH_MESSAGE_CONSTANT.EMAIL_ALREADY_TAKEN);

        const username_taken = await Auth.findOne({ email: payload.email });
        if (username_taken) throw new ConflictRequestError(AUTH_MESSAGE_CONSTANT.USERNAME_ALREADY_TAKEN);

        const hashPassword = await this.bcryptHelper.generateHashPassword(payload.password as string);

        const user = await Auth.create({
            password: hashPassword,
            email: payload.email,
            username: payload.username
        });

        if (!user) throw new BadRequestError(AUTH_MESSAGE_CONSTANT.UNABLE_SIGNUP_USER);

        try {
            //TODO: Mongo transaction
            const value = {
                _id: user._id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: user.email,
                username: user.username,
                address: payload.address
            };

            new AuthRegisterProducer(value).produce();
        } catch (error) {
            await Auth.findByIdAndDelete(user._id);
            throw new BadRequestError(error.message);
        }

        return {
            _id: user._id,
            email: user.email,
            username: user.username
        };
    }

    public async login(payload: ILoginPayload): Promise<{ accessToken: string }> {
        const user = await Auth.findOne({ email: payload.email }).select({
            password: 1,
            isDeleted: 1
        });

        if (!user) throw new BadRequestError(AUTH_MESSAGE_CONSTANT.INVALID_EMAIL_OR_PASSWORD);

        const passwordMatched = await this.bcryptHelper.verifyPassword(payload.password as string, user.password);
        if (!passwordMatched) throw new BadRequestError(AUTH_MESSAGE_CONSTANT.INVALID_EMAIL_OR_PASSWORD);

        if (user.isDeleted) throw new BadRequestError(AUTH_MESSAGE_CONSTANT.DISABLED_ACCOUNT);

        const accessToken = this.jsonWebToken.generateJWT({ id: user._id }, env.jwtConfig.JWT_SECRET, env.jwtConfig.JWT_EXPIRES, env.appConfig.APP_URL);
        return { accessToken };
    }

    public async updateUser(payload: IAuthUpdatePayload) {
        const { error, value } = updateValidation(payload);
        if (error) throw new BadRequestError(error.details[0].message);

        const { id, ...restPayload } = value;
        const user = await Auth.findByIdAndUpdate(id, restPayload, { new: true });

        if (!user) throw new BadRequestError(AUTH_MESSAGE_CONSTANT.UNABLE_TO_UPDATE_USER);

        return user;
    }

    public async enableDisableUser(id: string) {
        const user = await Auth.findById(id);
        if (!user) throw new NotFoundError(AUTH_MESSAGE_CONSTANT.USER_RECORD_NOT_FOUND);

        const enableDisable = await Auth.findByIdAndUpdate(id, { isDeleted: user.isDeleted ? false : true }, { new: true });
        if (!enableDisable) throw new BadRequestError(user.isDeleted ? AUTH_MESSAGE_CONSTANT.UNABLE_TO_ENABLE_USER : AUTH_MESSAGE_CONSTANT.UNABLE_TO_DISABLED_USER);

        return enableDisable;
    }

    public async deleteUser(id: string) {
        const user = await Auth.findByIdAndDelete(id);

        if (!user) throw new BadRequestError(AUTH_MESSAGE_CONSTANT.UNABLE_TO_DELETE_USER);

        return user;
    }
}
