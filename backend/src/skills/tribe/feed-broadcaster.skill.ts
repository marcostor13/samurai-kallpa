import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TribeResource, TribeResourceDocument } from '../../common/schemas/tribe-resource.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { ImpossibleFuture, ImpossibleFutureDocument } from '../../common/schemas/impossible-future.schema';

@Injectable()
export class FeedBroadcasterSkill {
    constructor(
        @InjectModel(TribeResource.name)
        private resourceModel: Model<TribeResourceDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(ImpossibleFuture.name)
        private futureModel: Model<ImpossibleFutureDocument>,
    ) { }

    async listResources(): Promise<TribeResource[]> {
        return this.resourceModel.find().populate('authorId', 'fullName avatarUrl').sort({ createdAt: -1 }).exec();
    }

    async getTeam(): Promise<any[]> {
        const users = await this.userModel.find({}, 'fullName role avatarUrl bio username phone birthDate address occupation quantumLeap imo').exec();
        const team: any[] = [];

        for (const user of users) {
            const futures = await this.futureModel.find({ samuraiId: user._id as any }, 'title status progressPercentage description evidences').exec();
            team.push({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
                bio: user.bio,
                avatarUrl: user.avatarUrl,
                phone: user.phone,
                birthDate: user.birthDate,
                address: user.address,
                occupation: user.occupation,
                quantumLeap: user.quantumLeap,
                imo: user.imo,
                futures: futures
            });
        }
        return team;
    }

    async getMemberProfile(id: string): Promise<any> {
        const user = await this.userModel.findById(id).exec();
        if (!user) return null;

        const futures = await this.futureModel.find({ samuraiId: user._id as any }).exec();
        return {
            ...user.toObject(),
            futures
        };
    }
}
