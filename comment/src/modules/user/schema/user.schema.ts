import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String, trim: true, required: true })
    firstName: string;

    @Prop({ type: String, trim: true, required: true })
    lastName: string;

    @Prop({ type: String, trim: true, required: true })
    address: string;

    @Prop({ type: Boolean, trim: true, required: true })
    isActive: boolean;

    @Prop({ type: Boolean, trim: true, required: true })
    isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass<User>(User);
