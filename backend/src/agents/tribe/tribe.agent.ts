import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChronicleKeeperSkill } from '../../skills/tribe/chronicle-keeper.skill';
import { FeedBroadcasterSkill } from '../../skills/tribe/feed-broadcaster.skill';

@Controller('tribe')
export class TribeAgent {
    constructor(
        private chronicleKeeper: ChronicleKeeperSkill,
        private feedBroadcaster: FeedBroadcasterSkill,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('resources')
    async publishResource(@Request() req: any, @Body() createDto: any) {
        return this.chronicleKeeper.publishResource(req.user.userId, createDto);
    }

    @Get('feed')
    async getFeed() {
        return this.feedBroadcaster.listResources();
    }

    @Get('team')
    async getTeam() {
        return this.feedBroadcaster.getTeam();
    }

    @Get('team/:id')
    async getMemberProfile(@Param('id') id: string) {
        return this.feedBroadcaster.getMemberProfile(id);
    }
}
