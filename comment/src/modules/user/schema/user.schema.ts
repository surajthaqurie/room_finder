import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String, trim: true, required: true })
    firstName: string;

    @Prop({ type: String, trim: true, required: true })
    lastName: string;

    @Prop({ type: Boolean, trim: true, required: true, default: false })
    isActive: boolean;

    @Prop({ type: Boolean, trim: true, required: true, default: false })
    isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass<User>(User);
