import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type ImpossibleFutureDocument = ImpossibleFuture & Document;

@Schema()
export class Evidence {
    @Prop({ type: String, enum: ['IMAGE', 'VIDEO', 'TEXT'] })
    type: string;

    @Prop()
    url: string;

    @Prop()
    content: string;

    @Prop({ default: Date.now })
    uploadedAt: Date;
}

@Schema()
export class ImpossibleFuture {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    samuraiId: User;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ min: 0, max: 100, default: 0 })
    progressPercentage: number;

    @Prop({
        default: 'IN_PROGRESS',
        enum: ['IN_PROGRESS', 'ACHIEVED', 'FAILED'],
    })
    status: string;

    @Prop([Evidence])
    evidences: Evidence[];

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const ImpossibleFutureSchema = SchemaFactory.createForClass(ImpossibleFuture);
