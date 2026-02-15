import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FutureAgent } from './future.agent';
import { VisionArchitectSkill } from '../../skills/future/vision-architect.skill';
import { EvidenceCollectorSkill } from '../../skills/future/evidence-collector.skill';
import { ProgressTrackerSkill } from '../../skills/future/progress-tracker.skill';
import { S3ProviderSkill } from '../../skills/future/s3-provider.skill';
import { ImpossibleFuture, ImpossibleFutureSchema } from '../../common/schemas/impossible-future.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ImpossibleFuture.name, schema: ImpossibleFutureSchema }]),
    ],
    controllers: [FutureAgent],
    providers: [
        VisionArchitectSkill,
        EvidenceCollectorSkill,
        ProgressTrackerSkill,
        S3ProviderSkill
    ],
    exports: [VisionArchitectSkill, EvidenceCollectorSkill, ProgressTrackerSkill, S3ProviderSkill],
})
export class FutureModule { }
