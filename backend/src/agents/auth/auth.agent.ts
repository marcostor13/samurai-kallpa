import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthSkill } from '../../skills/auth/auth.skill';

@Controller('auth')
export class AuthAgent {
    constructor(private authSkill: AuthSkill) { }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authSkill.validateUser(body.username, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authSkill.login(user);
    }
}
