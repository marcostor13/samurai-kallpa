import { Controller, Post, Body, Get, Patch, Put, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdentityManagerSkill } from '../../skills/samurai/identity-manager.skill';
import { DashboardOracleSkill } from '../../skills/samurai/dashboard-oracle.skill';

@Controller('samurai')
export class SamuraiAgent {
    constructor(
        private identityManager: IdentityManagerSkill,
        private dashboardOracle: DashboardOracleSkill,
    ) { }

    @Post('register')
    async register(@Body() createUserDto: any) {
        return this.identityManager.register(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Request() req: any) {
        return this.identityManager.getProfile(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateProfile(@Request() req: any, @Body() updateDto: any) {
        return this.identityManager.updateProfile(req.user.userId, updateDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('dashboard')
    async getDashboard(@Request() req: any) {
        return this.dashboardOracle.getDashboardStats(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('admin/users')
    async getAllUsers() {
        return this.identityManager.getAllUsers();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('admin/users/:id/password')
    async adminUpdatePassword(@Request() req: any, @Param('id') targetUserId: string, @Body() body: any) {
        return this.identityManager.adminUpdatePassword(req.user.userId, targetUserId, body.newPassword);
    }
}
