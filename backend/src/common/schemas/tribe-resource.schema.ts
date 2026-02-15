import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type TribeResourceDocument = TribeResource & Document;

@Schema()
export class TribeResource {
    @Prop({ required: true })
    title: string;

    @Prop({ type: String, enum: ['DOCUMENT', 'MEDIA', 'ANNOUNCEMENT'] })
    type: string;

    @Prop()
    url: string;

    @Prop()
    content: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    authorId: User;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const TribeResourceSchema = SchemaFactory.createForClass(TribeResource);
