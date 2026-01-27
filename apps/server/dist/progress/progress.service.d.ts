import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProgressDto } from './dto/progress.dto';
export declare class ProgressService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    updateProgress(userId: string, resourceId: string, updateProgressDto: UpdateProgressDto): Promise<any>;
    getProgress(userId: string, resourceId: string): Promise<any>;
    getUserProgress(userId: string): Promise<any[]>;
}
