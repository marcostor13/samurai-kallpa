import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TribeResource, TribeResourceDocument } from '../../common/schemas/tribe-resource.schema';

@Injectable()
export class ChronicleKeeperSkill {
    constructor(
        @InjectModel(TribeResource.name)
        private resourceModel: Model<TribeResourceDocument>,
    ) { }

    async publishResource(userId: string, createDto: any): Promise<TribeResource> {
        const newResource = new this.resourceModel({
            authorId: userId,
            ...createDto,
        });
        return newResource.save();
    }
}
