import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SamuraiAgent } from './samurai.agent';
import { IdentityManagerSkill } from '../../skills/samurai/identity-manager.skill';
import { DashboardOracleSkill } from '../../skills/samurai/dashboard-oracle.skill';
import { User, UserSchema } from '../../common/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [SamuraiAgent],
    providers: [IdentityManagerSkill, DashboardOracleSkill],
})
export class SamuraiModule { }
