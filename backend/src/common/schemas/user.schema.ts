import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ unique: true, sparse: true })
    email?: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ default: 'WARRIOR', enum: ['WARRIOR', 'SENSEI'] })
    role: string;

    @Prop()
    bio: string;

    @Prop()
    avatarUrl: string;

    @Prop()
    phone?: string;

    @Prop()
    birthDate?: string;

    @Prop()
    address?: string;

    @Prop()
    occupation?: string;

    @Prop()
    quantumLeap?: string;

    @Prop()
    imo?: string;

    @Prop({ default: Date.now })
    joinedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
