import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':resourceId')
  updateProgress(
    @Param('resourceId') resourceId: string,
    @Body() updateProgressDto: UpdateProgressDto,
    @Body('userId') userId: string // In real app, get from Req/Guard. For demo, passing in body/header
  ) {
    // Fallback for demo if userId not in body, assume admin or handle in AuthGuard
    // Since we don't have full JWT extraction middleware yet, we'll accept userId in body for testing
    // or we can implement a simple decorator.
    // Let's rely on the client passing userId for now to keep it simple, 
    // BUT typically this comes from request.user.id
    return this.progressService.updateProgress(userId, resourceId, updateProgressDto);
  }

  @Get('user/:userId')
  getUserProgress(@Param('userId') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Get(':resourceId/user/:userId')
  getResourceProgress(
    @Param('resourceId') resourceId: string,
    @Param('userId') userId: string
  ) {
    return this.progressService.getProgress(userId, resourceId);
  }
}
