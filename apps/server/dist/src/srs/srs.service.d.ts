import { SupabaseService } from '../supabase/supabase.service';
export declare class SrsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    private readonly intervals;
    getDueItems(userId: string): Promise<any[]>;
    reviewItem(userId: string, vocabId: string, quality: number): Promise<any>;
    addItemsToReview(userId: string, vocabIds: string[]): Promise<any[]>;
}
