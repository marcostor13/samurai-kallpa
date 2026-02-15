import { Controller, Post, Body, Get, Patch, Param, Delete, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisionArchitectSkill } from '../../skills/future/vision-architect.skill';
import { EvidenceCollectorSkill } from '../../skills/future/evidence-collector.skill';
import { ProgressTrackerSkill } from '../../skills/future/progress-tracker.skill';
import { S3ProviderSkill } from '../../skills/future/s3-provider.skill';

@Controller('futures')
@UseGuards(AuthGuard('jwt'))
export class FutureAgent {
    constructor(
        private visionArchitect: VisionArchitectSkill,
        private evidenceCollector: EvidenceCollectorSkill,
        private progressTracker: ProgressTrackerSkill,
        private s3Provider: S3ProviderSkill,
    ) { }

    @Post()
    async createFuture(@Request() req: any, @Body() createDto: any) {
        return this.visionArchitect.createFuture(req.user.userId, createDto);
    }

    @Get()
    async listFutures(@Request() req: any) {
        return this.visionArchitect.listFutures(req.user.userId);
    }

    @Post(':id/evidence')
    @UseInterceptors(FileInterceptor('file'))
    async addEvidence(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any
    ) {
        let url = body.url;
        if (file) {
            url = await this.s3Provider.uploadFile(file);
        }

        const evidenceDto = {
            type: body.type || 'IMAGE',
            url: url,
            content: body.content
        };

        return this.evidenceCollector.addEvidence(id, evidenceDto);
    }

    @Patch(':id/progress')
    async updateProgress(@Param('id') id: string, @Body() body: any) {
        return this.progressTracker.updateProgress(id, body.percentage, body.status);
    }

    @Patch(':id')
    async updateFuture(@Param('id') id: string, @Body() body: any) {
        return this.visionArchitect.updateFuture(id, body);
    }

    @Delete(':id')
    async deleteFuture(@Param('id') id: string) {
        return this.visionArchitect.deleteFuture(id);
    }
}
