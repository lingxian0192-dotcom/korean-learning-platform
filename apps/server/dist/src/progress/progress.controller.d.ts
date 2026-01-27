import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/progress.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    updateProgress(resourceId: string, updateProgressDto: UpdateProgressDto, userId: string): Promise<any>;
    getUserProgress(userId: string): Promise<any[]>;
    getResourceProgress(resourceId: string, userId: string): Promise<any>;
}
