import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImpossibleFuture, ImpossibleFutureDocument } from '../../common/schemas/impossible-future.schema';

@Injectable()
export class VisionArchitectSkill {
    constructor(
        @InjectModel(ImpossibleFuture.name) private futureModel: Model<ImpossibleFutureDocument>
    ) { }

    async createFuture(samuraiId: string, data: any) {
        return this.futureModel.create({
            samuraiId,
            ...data,
            status: 'IN_PROGRESS',
            progressPercentage: 0
        });
    }

    async listFutures(samuraiId: string) {
        return this.futureModel.find({ samuraiId: samuraiId as any }).sort({ createdAt: -1 });
    }

    async addEvidence(futureId: string, evidence: { type: string, url: string, content?: string }) {
        const future = await this.futureModel.findById(futureId);
        if (!future) throw new NotFoundException('Future not found');

        future.evidences.push(evidence as any);
        return future.save();
    }

    async updateFuture(id: string, data: any) {
        const updated = await this.futureModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!updated) throw new NotFoundException('Future not found');
        return updated;
    }

    async deleteFuture(id: string) {
        const deleted = await this.futureModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException('Future not found');
        return { success: true };
    }
}
