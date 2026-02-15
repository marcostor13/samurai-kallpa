import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthAgent } from './auth.agent';
import { AuthSkill } from '../../skills/auth/auth.skill';
import { JwtStrategy } from '../../skills/auth/jwt.strategy';
import { User, UserSchema } from '../../common/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthAgent],
    providers: [AuthSkill, JwtStrategy],
    exports: [AuthSkill],
})
export class AuthModule { }
