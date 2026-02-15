import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TribeAgent } from './tribe.agent';
import { ChronicleKeeperSkill } from '../../skills/tribe/chronicle-keeper.skill';
import { FeedBroadcasterSkill } from '../../skills/tribe/feed-broadcaster.skill';
import { TribeResource, TribeResourceSchema } from '../../common/schemas/tribe-resource.schema';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { ImpossibleFuture, ImpossibleFutureSchema } from '../../common/schemas/impossible-future.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TribeResource.name, schema: TribeResourceSchema },
            { name: User.name, schema: UserSchema },
            { name: ImpossibleFuture.name, schema: ImpossibleFutureSchema }
        ]),
    ],
    controllers: [TribeAgent],
    providers: [ChronicleKeeperSkill, FeedBroadcasterSkill],
})
export class TribeModule { }
