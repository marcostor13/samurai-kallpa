import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImpossibleFuture, ImpossibleFutureDocument } from '../../common/schemas/impossible-future.schema';

@Injectable()
export class ProgressTrackerSkill {
    constructor(
        @InjectModel(ImpossibleFuture.name)
        private futureModel: Model<ImpossibleFutureDocument>,
    ) { }

    async updateProgress(futureId: string, percentage: number, status?: string): Promise<ImpossibleFuture> {
        const future = await this.futureModel.findById(futureId);
        if (!future) {
            throw new NotFoundException('Future not found');
        }
        future.progressPercentage = percentage;
        if (status) {
            future.status = status;
        }
        // Auto-complete logic?
        if (percentage === 100 && future.status !== 'ACHIEVED') {
            future.status = 'ACHIEVED';
        }
        return future.save();
    }
}
