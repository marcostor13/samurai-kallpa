import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImpossibleFuture, ImpossibleFutureDocument } from '../../common/schemas/impossible-future.schema';

@Injectable()
export class EvidenceCollectorSkill {
    constructor(
        @InjectModel(ImpossibleFuture.name)
        private futureModel: Model<ImpossibleFutureDocument>,
    ) { }

    async addEvidence(futureId: string, evidenceDto: any): Promise<ImpossibleFuture> {
        const future = await this.futureModel.findById(futureId);
        if (!future) {
            throw new NotFoundException('Future not found');
        }
        future.evidences.push({
            ...evidenceDto,
            uploadedAt: new Date(),
        });
        return future.save();
    }

    async deleteEvidence(futureId: string, evidenceId: string): Promise<ImpossibleFuture> {
        const future = await this.futureModel.findById(futureId);
        if (!future) throw new NotFoundException('Future not found');

        future.evidences = future.evidences.filter(ev => (ev as any)._id.toString() !== evidenceId);
        return future.save();
    }
}
